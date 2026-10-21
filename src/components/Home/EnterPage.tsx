import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Frame } from '@react95/core';
import styled from 'styled-components';
import { SplitPixelBackground } from '../Background/SplitPixelBackground.tsx';
import photo1 from '../../assets/photos/HAWAII15.jpeg';
import photo2 from '../../assets/photos/HAWAII_4.jpg';
import headshot from '../../assets/photos/HAWAII11.jpeg';

const Page = styled.main`
  position: relative;
  isolation: isolate;
  min-height: 100svh;
  display: grid;
  place-items: center;
  box-sizing: border-box;
  padding: 48px 24px;
  background: #0f0d0c;
  font-family: 'MS Sans Serif', sans-serif;
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 0;
    background: rgba(24, 17, 23, 0.3);
    pointer-events: none;
  }
`;
const Welcome = styled.section`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: min(100%, 560px);
  text-align: center;
  color: var(--r95-color-headerText);
`;
const Name = styled.h1`
  margin: 0;
  font-size: clamp(28px, 5vw, 44px);
  line-height: 1.15;
  letter-spacing: 0.035em;
  text-shadow: 2px 2px var(--r95-color-headerBackground);
`;
const Subtitle = styled.p`
  margin: 14px 0 38px;
  font-size: 16px;
  line-height: 1.5;
  text-shadow: 1px 1px var(--r95-color-borderDarkest);
`;
const Portrait = styled.img`
  display: block;
  width: clamp(176px, 29vw, 232px);
  aspect-ratio: 1;
  object-fit: cover;
  object-position: 50% 58%;
`;
const Enter = styled(Button)`
  min-width: 112px;
  min-height: 36px;
  padding: 6px 18px;
  margin-top: 28px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  &:focus-visible {
    outline: 2px dotted var(--r95-color-headerText);
    outline-offset: 5px;
  }
`;
const Address = styled.p`
  margin: 28px 0 0;
  font-size: 13px;
  letter-spacing: 0.08em;
  text-shadow: 1px 1px var(--r95-color-borderDarkest);
`;
const EnterPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Page>
      <SplitPixelBackground photoLeft={photo1} photoRight={photo2} />
      <Welcome aria-labelledby="welcome-title">
        <Name id="welcome-title">BRYANNA PLAISIR</Name>
        <Subtitle>my personal corner of the internet</Subtitle>
        <Frame boxShadow="$out" bgColor="$material" padding="8px">
          <Frame boxShadow="$in" padding="2px">
            <Portrait src={headshot} alt="Bryanna in Hawaii" fetchPriority="high" />
          </Frame>
        </Frame>
        <Enter type="button" onClick={() => void navigate('/about')} aria-label="Enter Bryanna's portfolio">
          Enter <span aria-hidden="true">→</span>
        </Enter>
        <Address>brybrie.com</Address>
      </Welcome>
    </Page>
  );
};
export default EnterPage;
