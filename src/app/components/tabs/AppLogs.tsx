import { Code, Flex, Text } from '@chakra-ui/react';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useCopyToClipboard } from 'react-use';
import styled, { useTheme } from 'styled-components';
import { selectAppLogs, clearLogs } from '../../../features/appLogsSlice';
import { useAppSelector } from '../../hooks';
import { TextButton } from '../TextButton';

const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 17px;
`;

const NoLogYet = styled.div`
  color: ${(props) => props.theme.appLogTimeStampColor};
  font-size: 13px;
  font-weight: 600;
  text-align: center;
  margin: auto;
`;

const Timestamp = styled.span`
  font-size: 10px;
  display: inline-block;
  min-width: 48px;
  max-width: 100px;
  color: ${(props) => props.theme.appLogTimeStampColor};
  user-select: text;
`;

const Content = styled(Timestamp)`
  display: inline;
  color: ${(props) => props.theme.appLogContentColor};
  user-select: text;
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
          <NoLogYet>No logs yet...</NoLogYet>
        )}
      </Code>
      <ButtonRow>
        <TextButton onClick={() => dispatch(clearLogs())} text="Clear" title="Clear logs" />
         <TextButton
          onClick={() => copyToClipboard(appLogs.join('\r\n'))}
          text="Copy"
          title="Copy to clipboard"
        />
      </ButtonRow>
    </Flex>
  );
};
