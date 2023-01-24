import React, {useState} from 'react';
import { useSelector } from 'react-redux';
import { Flex } from '@chakra-ui/react'
import styled from 'styled-components';
import { selectStatus } from '../../features/statusSlice';
import { selectedTheme } from '../../features/uiStatusSlice';
import { ExitPanel } from './ExitPanel';
import { RoutersStats } from './RouterStats';
import { SpeedStats } from './SpeedStats';
import AboutIconDark from '../../../images/about_dark.svg';
import AboutIconWhite from '../../../images/about_white.svg';
import AboutCloseIconDark from '../../../images/about_close_dark.svg';
import AboutCloseIconWhite from '../../../images/about_close_white.svg';
const { shell } = require('electron')

const AboutText = styled.div`
  font-size: 14px;
  position: fixed;
  bottom: 15px;
  color: ${(props) => props.theme.aboutLabel};
  display: flex;
  justify-content: space-between;
  width: 65px;
  cursor: pointer;
`;

const ModalWrapper = styled.div`
  position: absolute;
  overflow: hidden;
  padding: 0 25px;
  background: ${(props) =>  props.theme.modalBg};
  left: 0;
  width: 421px;
  height: 296px;
  bottom: 0;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
`;
const ModalHeader = styled.div`
  height: 70px;
  padding: 18px 0;
  display: flex;
  margin: 0;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const CloseBtn = styled.button`
margin-left: auto;
border: none;
background: transparent;
`;

const ModalHeaderLabel = styled.div`
  margin-left: auto;
`;

const ModalHeaderAboutLabel = styled.span`
  font-size: 22px;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
  color: ${(props) =>  props.theme.appLogContentColor};
`;

const ModalHeaderBelnetLabel = styled.span`
  font-size: 22px;
  font-weight: 700;
  font-family: 'Poppins', sans-serif;
  color: ${(props) =>  props.theme.aboutBelnetColor};
`;
const ModalBody = styled.div`
  height: 226px;
  overflow: hidden scroll;
  padding-bottom: 25px;
`;

const Para = styled.p`
font-size: 14px;
font-weight: 300;
color: ${(props) => props.theme.streamLabelColor};
font-family: 'Poppins', sans-serif;
letter-spacing: .75px;
line-height: 20px;
`;

const Anchor = styled.a`
color: #2d93f7;
word-break: break-all;
cursor: pointer;
`;
const Heading = styled.h3`
font-size: 14px;
font-weight: 600;
color: ${(props) => props.theme.appLogContentColor};
font-family: 'Poppins', sans-serif;
line-height: 25px;
letter-spacing: .75px;
`;

const ListContainer = styled.ul`
padding-left: 25px;
`;

const List = styled.li`
font-size: 14px;
    font-weight: 300;
    letter-spacing: .75px;
    color: ${(props) => props.theme.streamLabelColor};
    font-family: Poppins, sans-serif;
`;

const ListHeading = styled.span`
font-size: 14px;
font-weight: 600;
color: ${(props) => props.theme.appLogContentColor};
font-family: 'Poppins', sans-serif;
letter-spacing: .75px;
`;
export const MainTab = (): JSX.Element => {
  // Select (i.e. extract the daemon status from our global redux state)
  const daemonStatus = useSelector(selectStatus);
  const themeType = useSelector(selectedTheme);
  const [openModal, isOpen] = useState(false);
  const openAboutModal = () => {
    isOpen(true);
  }

  const openExternalLink = (path: any) => {
    shell.openExternal(path)
  }

  return (
    <>
      <ExitPanel />
      
      <Flex
        flexDirection="row"
        justifyContent="space-between"
        minWidth="300px"
      >
        <RoutersStats
          activePaths={daemonStatus.numPathsBuilt}
          ratio={daemonStatus.ratio}
          numRouters={daemonStatus.numRoutersKnown}
        />
      </Flex>
      <Flex
        flexDirection="row"
        justifyContent="space-between"
        minWidth="300px"
      >
        <SpeedStats/>
        {/* <RoutersStats
          activePaths={daemonStatus.numPathsBuilt}
          ratio={daemonStatus.ratio}
          numRouters={daemonStatus.numRoutersKnown}
        /> */}
      </Flex>
      <Flex justifyContent="center" paddingTop="15px">
        <AboutText onClick={openAboutModal}>{themeType === 'light' ? <img src={AboutIconWhite} alt="" /> : <img src={AboutIconDark} alt="" />} About</AboutText>
      </Flex>
      {openModal && <ModalWrapper className='modal'>
        <ModalHeader className='modalHeader'>
          <ModalHeaderLabel>
            <ModalHeaderAboutLabel>About</ModalHeaderAboutLabel> <ModalHeaderBelnetLabel>BelNet</ModalHeaderBelnetLabel>
          </ModalHeaderLabel>
          <CloseBtn onClick={() => isOpen(false)}>
          {themeType === 'light' ? <img src={AboutCloseIconWhite} alt="" /> : <img src={AboutCloseIconDark} alt="" />}
          </CloseBtn>
        </ModalHeader>
        <ModalBody className='modalBody'>
          <Para>
            BelNet is a decentralized VPN service built on top of the Beldex Network. The BelNet dVPN utilizes Beldex masternodes to route your connection.
          </Para>
          <br/>
          <Para>A unique onion routing protocol is used to encrypt and route your data.</Para>
          <br/>
          <Heading>What are exit nodes?</Heading>
          <Para>Exit nodes on the Beldex network helps you browse the internet without exposing your IP address. They also hide your geographical location.</Para>
          <br/>
          <Para>BelNet has several uses and chief among them are,</Para>
          <ListContainer>
            <List>
              <ListHeading>Unblockching content:</ListHeading> Certain websites may be blocked in your region. BelNet can be used to unblock these websites. For example, a streaming platform may be restricted in your region. With BelNet, you can unblock this website, pay for the streaming service and enjoy watching the content that you love!
            </List>
            <br/>
            <List>
              <ListHeading>Masking your IP & Location:</ListHeading> The websites that you visit only see the exit node’s IP address while your IP remains concealed. It is also hidden from your Internet Service Provider (ISP), mobile network operator, and even prying regulators. Your online activity remains truly anonymous!
            </List>
            <br/>
            <List>
            <ListHeading>Security:</ListHeading> You are protected from hackers and malicious actors that try to steal your information. Since all data about you remains private when you’re browsing, there’s very little window of opportunity for bad actors to pilfer your personal and private information.
            </List>
            <br/>
            <List>
            <ListHeading>Protects your identity:</ListHeading> Masking your IP also protects your identity online. Your browsing history, purchase history, and any financial information is only available to you. That means, no more cookies, trackers, and relevant ads that pursue you no matter where you go.
            </List>
            <br/>
          </ListContainer>
          <Heading>Does BelNet block ads?</Heading>
          <Para>BelNet conceals your IP. Thus, your browsing history remains private to the destination website and third parties. However, you may still be shown ads that aren’t relevant to your browsing history.</Para>
          <br/>
          <Heading>Where are the current exit nodes located?</Heading>
          <Para>There are currently three active exit nodes maintained by the Beldex foundation. They are located in the Netherlands (2) and France (1).</Para>
          <br/>
          <Heading>Can you set up an exit node?</Heading>
          <Para>Yes, anyone can set up an exit node. Check the <Anchor onClick={() => openExternalLink("https://belnet.beldex.io/")}>BelNet</Anchor> website for complete documentation on how to set up an exit node.</Para>
          <br/>
          <Para>You can also find the setup guide under <Anchor onClick={() => openExternalLink("https://docs.beldex.io/advanced/belnet/exit-node-setup-guide")}>Beldex docs.</Anchor></Para>
          <br/>
          <Para>Exit node contributors will be rewarded and their node will be added to the BelNet app. To add your exit node to the BelNet app, reach out to <Anchor href="mailto:outreach@beldex.io">outreach@beldex.io</Anchor></Para>
          <br/>
          <Heading>What are MN Apps?</Heading>
          <Para>MN Apps are decentralized applications hosted on BelNet.</Para>
          <br/>
          <Para>MN Apps are privacy preserving applications and do not collect or reveal any personal information about the user.</Para>
          <br/>
          <Para>They can be accessed only by connecting to BelNet.</Para>
          <br/>
          <Para>Below is a sample MNApp that you can access by enabling BelNet:</Para>
          <br/>
          <Para><Anchor onClick={() => openExternalLink("http://675wmqqbzg6nqs688e1n3bti6ter4kt5q4u5bs1c4quutpnyxsxy.bdx")}>http://675wmqqbzg6nqs688e1n3bti6ter4kt5q4u5bs1c4quutpnyxsxy.bdx/</Anchor></Para>
          <br/>
          <Heading>What are BNS Names?</Heading>
          <Para>BNS stands for Beldex Name Service. BNS names are human readable domain names on BelNet. BNS is a censorship-free, decentralized, unstoppable domain name service. </Para>
          <br/>
          <Para>It has many utilities. For example, BNS names could be mapped to MN Apps to make them easily readable and discoverable.</Para>
          <br/>
          <Para>The Beldex team is researching the possibility of mapping BNS names to BChat IDs and your wallet address so you can send and receive messages as well as BDX with your BNS name.</Para>
          <br/>
          <Para>BNS names end with the top level domain .bdx</Para>
          <br/>
          <Para>Example: yourname.bdx</Para>
          <br/>
          <Heading>Credits:</Heading>
          <Para>BelNet uses several protocols that were designed by the open source projects Tor, I2P, and Lokinet.</Para>
          <br/>
        </ModalBody>
      </ModalWrapper>}
    </>
  );
};
