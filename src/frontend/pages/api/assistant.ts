// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import type { NextApiRequest, NextApiResponse } from 'next';
import InstrumentationMiddleware from '../../utils/telemetry/InstrumentationMiddleware';
import { IAssistantMessage } from '../../types/Assistant';

const { ASSISTANT_ENABLED = '', AGENT_ADDR = '' } = process.env;

const AGENT_TIMEOUT_MS = 120000;

type TResponse = { reply: string } | { error: string } | '';

const toHistory = (history: unknown): IAssistantMessage[] =>
  Array.isArray(history)
    ? history
        .filter(
          ({ role, content }) => (role === 'user' || role === 'assistant') && typeof content === 'string'
        )
        .map(({ role, content }) => ({ role, content }))
    : [];

const handler = async ({ method, body }: NextApiRequest, res: NextApiResponse<TResponse>) => {
  if (ASSISTANT_ENABLED !== 'true' || !AGENT_ADDR) {
    return res.status(404).send('');
  }

  switch (method) {
    case 'POST': {
      const { message, history } = body ?? {};
      if (typeof message !== 'string' || !message.trim()) {
        return res.status(400).json({ error: 'message is required' });
      }

      const response = await fetch(`http://${AGENT_ADDR}/prompt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history: toHistory(history) }),
        signal: AbortSignal.timeout(AGENT_TIMEOUT_MS),
      });

      if (!response.ok) {
        return res.status(502).json({ error: `Agent request failed with status ${response.status}` });
      }

      const data = await response.json();
      const messages = data?.response?.messages;
      const reply = Array.isArray(messages) ? messages[messages.length - 1]?.content : undefined;
      if (typeof reply !== 'string') {
        return res.status(502).json({ error: 'Agent returned an unexpected response' });
      }

      return res.status(200).json({ reply });
    }

    default: {
      return res.status(405).send('');
    }
  }
};

export default InstrumentationMiddleware(handler);
