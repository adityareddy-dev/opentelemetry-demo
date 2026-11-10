// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { FormEvent, useEffect, useRef, useState } from 'react';
import { SpanStatusCode, trace } from '@opentelemetry/api';
import ApiGateway from '../../gateways/Api.gateway';
import { IAssistantMessage } from '../../types/Assistant';
import { CypressFields } from '../../utils/enums/CypressFields';
import * as S from './AssistantPanel.styled';

const tracer = trace.getTracer('frontend-web');

const AssistantPanel = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<IAssistantMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsEnabled(window.ENV?.NEXT_PUBLIC_ASSISTANT_ENABLED === 'true');
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, isLoading]);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const message = input.trim();
    if (!message || isLoading) return;

    const history = messages;
    setMessages([...history, { role: 'user', content: message }]);
    setInput('');
    setError('');
    setIsLoading(true);

    return tracer.startActiveSpan('assistant.submit', async span => {
      try {
        const { reply } = await ApiGateway.askAssistant(message, history);
        setMessages(current => [...current, { role: 'assistant', content: reply }]);
      } catch (err) {
        span.recordException(err as Error);
        span.setStatus({ code: SpanStatusCode.ERROR });
        setError('The assistant could not answer. Please try again.');
      } finally {
        span.end();
        setIsLoading(false);
      }
    });
  };

  if (!isEnabled) return null;

  if (!isOpen) {
    return (
      <S.Toggle data-cy={CypressFields.AssistantToggle} onClick={() => setIsOpen(true)}>
        Ask the assistant
      </S.Toggle>
    );
  }

  return (
    <S.Panel data-cy={CypressFields.AssistantPanel} aria-label="Shop assistant">
      <S.Header>
        <S.Title>Shop assistant</S.Title>
        <S.Close $type="link" aria-label="Close assistant" onClick={() => setIsOpen(false)}>
          ×
        </S.Close>
      </S.Header>
      <S.MessageList ref={listRef} aria-live="polite">
        {messages.length === 0 && <S.Status>Ask about products, prices, shipping or your cart.</S.Status>}
        {messages.map((message, index) => (
          <S.Message key={index} $role={message.role}>
            {message.content}
          </S.Message>
        ))}
        {isLoading && <S.Status>Thinking...</S.Status>}
        {error && <S.Status role="alert">{error}</S.Status>}
      </S.MessageList>
      <S.Form onSubmit={onSubmit}>
        <S.Input
          value={input}
          onChange={event => setInput(event.target.value)}
          placeholder="Ask a question"
          aria-label="Question for the assistant"
          disabled={isLoading}
        />
        <S.Send type="submit" disabled={isLoading || !input.trim()}>
          Send
        </S.Send>
      </S.Form>
    </S.Panel>
  );
};

export default AssistantPanel;
