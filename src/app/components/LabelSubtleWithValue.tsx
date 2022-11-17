import { Flex } from '@chakra-ui/react';
import React from 'react';
import useCopyToClipboard from 'react-use/lib/useCopyToClipboard';
import styled, { DefaultTheme } from 'styled-components';
import { FiDownloadCloud, FiUploadCloud } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { selectedTheme, } from '../../features/uiStatusSlice';
import  {DarkThemeCopyButton}  from './ThemeChangeButton/DarkThemeCopyButton';
import  {LightThemeCopyButton}  from './ThemeChangeButton/LightThemeCopyButton';

const GeneralInfoLabelKey = styled.div`
  color: ${(props) => props.theme.labelKeyColor};
  padding-inline-end: 5px;
  font-size: 12px;
  user-select: none;
  white-space: nowrap;
  font-family: 'Poppins', sans-serif;
`;

const GeneralInfoLabelValue = styled(GeneralInfoLabelKey)<{
  theme: DefaultTheme;
}>`
  color: ${(props) => props.theme.labelValueColor};
  white-space: nowrap;
  overflow: hidden;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  text-overflow: ellipsis;
  user-select: none;
`;

const StyledLabelSubtle = styled.div`
  color: ${(props) => props.theme.labelValueColor};
  padding-inline-end: 5px;
  font-size: 13px;
  line-height: 20px;
  user-select: none;
  white-space: nowrap;
  font-family: 'Poppins', sans-serif;
`;

const StyledValue = styled(StyledLabelSubtle)<{
  theme: DefaultTheme;
}>`
  color: ${(props) => props.theme.labelKeyColor};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  user-select: none;
`;

const InlineIconButton = styled.button<{ size: string; theme: DefaultTheme }>`
  width: ${(props) => props.size};
  height: ${(props) => props.size};
  color: ${(props) => props.theme.labelKeyColor};
  background: none;
  flex-shrink: 0;
  border: none;
  cursor: pointer;
  transition: 0.25s linear;
  border-radius: 7px;
  margin-left: auto;
  :hover {
    color: ${(props) => props.theme.labelValueColor};
  }

  svg {
    width: 100%;
    height: 100%;
  }
`;

const InlineIcon = styled.div<{ size: string; theme: DefaultTheme }>`
  width: ${(props) => props.size};
  height: ${(props) => props.size};
  color: ${(props) => props.theme.labelKeyColor};
  background: none;
  flex-shrink: 0;
  border: none;

  svg {
    width: 100%;
    height: 100%;
  }
`;

const CopyToClipboardIcon = (props: { valueToCopy: string }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const themeSelected = useSelector(selectedTheme);
  const [_getclipboard, copyToClipboard] = useCopyToClipboard();
  return (
    <InlineIconButton
      size="15px"
      onClick={() => {
        copyToClipboard(props.valueToCopy);
      }}
      title="Copy to clipboard"
    >
      {themeSelected === 'light' ?  <LightThemeCopyButton /> : <DarkThemeCopyButton/>}
    </InlineIconButton>
  );
};

export const LabelSubtleWithValue = (props: {
  label: string;
  value: string;
  showCopyToClipBoard?: boolean;
  center?: boolean;
}): JSX.Element => {
  const { label, value, showCopyToClipBoard = false, center = true } = props;

  return (
    <Flex justifyContent={center ? 'center' : 'start'}>
      <GeneralInfoLabelKey>{label}: </GeneralInfoLabelKey>
      <GeneralInfoLabelValue>{value}</GeneralInfoLabelValue>
      {value?.length && showCopyToClipBoard ? (
        <CopyToClipboardIcon valueToCopy={value} />
      ) : null}
    </Flex>
  );
};

const UploadInlineIcon = (props: { size: string }): JSX.Element => {
  return (
    <InlineIcon size={props.size} title="Upload speed">
      <FiUploadCloud />
    </InlineIcon>
  );
};

const DownloadInlineIcon = (props: { size: string }): JSX.Element => {
  return (
    <InlineIcon size={props.size} title="Download speed">
      <FiDownloadCloud />
    </InlineIcon>
  );
};

const Pill = styled.span<{ ledColor: string; size: string }>`
  width: ${(props) => props.size};
  height: ${(props) => props.size};
  border-radius: 50%;
  margin: auto ${(props) => props.size} auto ${(props) => props.size};

  background-color: ${(props) => props.ledColor};
`;

const KeyValueWithIconAndPill = (props: {
  label: string;
  value: string;
  icon: React.ReactNode;
  fontSize: string;
  marginBottom?: string;
  pillColor?: string;
}): JSX.Element => {
  const { label, value, icon, pillColor } = props;
  return (
    <Flex
      justifyContent="start"
      fontSize={props.fontSize}
      marginBottom={props.marginBottom}
    >
      {icon}
      {!!pillColor && <Pill ledColor={pillColor} size="0.8em" />}
      <StyledLabelSubtle>{label}: </StyledLabelSubtle>
      <StyledValue>{value}</StyledValue>
    </Flex>
  );
};

const SpeedWithIcon = (props: {
  label: string;
  value: string;
  icon: React.ReactNode;
}): JSX.Element => {
  return (
    <KeyValueWithIconAndPill
      label={props.label}
      fontSize="1rem"
      marginBottom="0.5rem"
      value={props.value}
      icon={props.icon}
    />
  );
};

export const HSpacer = styled.span<{ width: string }>`
  width: ${(props) => props.width};
  height: 1px;
  background: none;
`;
