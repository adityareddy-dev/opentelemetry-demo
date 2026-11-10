// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import Button from '../Button';

export const Toggle = styled(Button)`
  position: fixed;
  right: 20px;
  bottom: 20px;
  height: auto;
  font-size: ${({ theme }) => theme.sizes.dSmall};
  z-index: 1000;
`;

export const Panel = styled.section`
  position: fixed;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 70%;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.white};
  z-index: 1000;
  border-radius: 10px 10px 0 0;
  box-shadow: 0 2px 2px 0 rgb(0 0 0 / 14%), 0 3px 1px -2px rgb(0 0 0 / 12%), 0 1px 5px 0 rgb(0 0 0 / 20%);

  ${({ theme }) => theme.breakpoints.desktop} {
    right: 20px;
    bottom: 20px;
    width: 400px;
    height: 520px;
    border-radius: 10px;
  }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightBorderGray};
`;

export const Title = styled.h5`
  margin: 0;
  font-size: ${({ theme }) => theme.sizes.dMedium};
`;

export const Close = styled(Button)`
  height: auto;
  padding: 0 8px;
  font-size: ${({ theme }) => theme.sizes.dMedium};
`;

export const MessageList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const Message = styled.p<{ $role: 'user' | 'assistant' }>`
  margin: 0;
  padding: 8px 12px;
  border-radius: 10px;
  max-width: 85%;
  white-space: pre-wrap;
  font-size: ${({ theme }) => theme.sizes.dSmall};
  align-self: ${({ $role }) => ($role === 'user' ? 'flex-end' : 'flex-start')};
  color: ${({ $role, theme }) => ($role === 'user' ? theme.colors.white : theme.colors.textGray)};
  background: ${({ $role, theme }) => ($role === 'user' ? theme.colors.otelBlue : theme.colors.backgroundGray)};
`;

export const Status = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.sizes.mSmall};
  color: ${({ theme }) => theme.colors.textLightGray};
`;

export const Form = styled.form`
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid ${({ theme }) => theme.colors.lightBorderGray};
`;

export const Input = styled.input`
  flex: 1;
  padding: 8px 12px;
  outline: none;
  font-size: ${({ theme }) => theme.sizes.dSmall};
  border-radius: 10px;
  background: #f9f9f9;
  border: 1px solid #cacaca;
`;

export const Send = styled(Button)`
  height: auto;
  font-size: ${({ theme }) => theme.sizes.dSmall};
`;
