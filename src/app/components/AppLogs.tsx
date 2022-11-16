import { Code, Flex, Text } from '@chakra-ui/react';
import React from 'react';
import { MdOutlineContentCopy } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { useCopyToClipboard } from 'react-use';
import styled, { useTheme } from 'styled-components';
import { clearLogs, selectAppLogs } from '../../features/appLogsSlice';
import { useAppSelector } from '../hooks';
import { BelnetIconButton } from './BelnetIconButton';
import { TextButton } from './TextButton';

const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 17px;
`;

const Timestamp = styled.span`
  font-size: 10px;
  display: inline-block;
  width: 48px;
  color: ${(props) => props.theme.appLogTimeStampColor};
`;

const Content = styled(Timestamp)`
  display: inline;
  color: ${(props) => props.theme.appLogContentColor};
`;

export const AppLogs = (): JSX.Element => {
  const { appLogs } = useAppSelector(selectAppLogs);
  const hasLogLine = Boolean(appLogs.length);
  const dispatch = useDispatch();
  const theme = useTheme();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_clip, copyToClipboard] = useCopyToClipboard();

  return (
    <Flex flexDirection="column" height="100%" style={{paddingTop: '10px'}}>
      <Code
        size="xs"
        boxShadow={theme.appLogBS}
        overflowY="auto"
        textAlign="left"
        maxHeight="163px"
        display="flex"
        wordBreak="break-all"
        fontFamily="'Poppins', sans-serif"
        borderRadius="12px"
        flexDirection="column"
        flexGrow={1}
        flexShrink={300}
        backgroundColor={theme.inputBackground}
      >
        {hasLogLine ? (
          appLogs.map((logLine) => {
            const separator = logLine.indexOf(':');
            const timestamp = logLine.substring(0, separator);
            const content = logLine.substring(separator);
            return (
              <span style={{padding: '3px 14px 4px 26px'}}>
                <Timestamp>{new Date(parseInt(timestamp)).toLocaleTimeString()}:</Timestamp>
                <Content>{content.replace(': ','')}</Content>
              </span>
            );
          })
        ) : (
          <Text fontSize={12}>No logs yet...</Text>
        )}
      </Code>
      <ButtonRow>
        <TextButton
          onClick={() => dispatch(clearLogs())}
          text="Clear"
          title="Clear logs"
        />
         <TextButton
          onClick={() => copyToClipboard(appLogs.join('\r\n'))}
          text="Copy"
          title="Copy to clipboard"
        />
      </ButtonRow>
    </Flex>
  );
};
