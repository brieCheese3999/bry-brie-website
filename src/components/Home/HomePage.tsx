import React from "react";
import { useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { SplitPixelBackground } from "../Background/SplitPixelBackground.tsx";
import photo1 from "../../assets/photos/HAWAII15.jpeg";
import photo2 from "../../assets/photos/HAWAII_4.jpg";
import { MOBILE_BREAKPOINT_PX } from '../useResponsiveMode';
import Win95Portfolio from "./Win95Portfolio.tsx";
import {ClipArt} from "../Background/BackgroundClipArt.tsx";
import {defaultClipArt} from "../data.ts";
import type {ClipArtContent} from "../types.ts";
import {List, TaskBar} from "@react95/core";
import { Camera } from "@react95/icons/Camera";
import { Mail } from "@react95/icons/Mail";
import { Mmsys113 } from "@react95/icons/Mmsys113";
import { Mspaint } from "@react95/icons/Mspaint";

interface HomePageProps {
    content?: ClipArtContent;
}

const PageWrapper = styled.div`
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
`;

const BackgroundLayer = styled.div`
  /* Fixed to the viewport (not absolute within PageWrapper) so the background
     is always exactly viewport-sized. PageWrapper grows to fit each tab's
     content, and an absolute background would stretch with it — making the
     canvas re-crop (object-fit: cover) every time you switch tabs. Fixed keeps
     its dimensions constant across tab switches and while scrolling. */
  position: fixed;
  inset: 0;
  z-index: 0;
`;

const ForegroundLayer = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  /* No top nav bar anymore — the sections live in the Start menu. Keep a
     little breathing room above the portfolio window, and clear the fixed
     taskbar at the bottom. */
  padding: 40px 24px 56px;

  @media (max-width: ${MOBILE_BREAKPOINT_PX}px) {
    padding: 32px 16px 56px;
  }
`;

const ClipArtBackLayer = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
`;

const ClipArtFrontLayer = styled.div`
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
`;

const HomePage: React.FC<HomePageProps> = ({ content = defaultClipArt }) => {
    const navigate = useNavigate();
    const backItems = content.items.filter(item => item.layer !== 'front');
    const frontItems = content.items.filter(item => item.layer === 'front');

    // Start menu destinations match the main window's section navigation.
    const startMenu = (
        <List width="200px">
            <List.Item icon={<Mmsys113 variant="32x32_4" />} onClick={() => navigate('/about')}>
                About
            </List.Item>
            <List.Item icon={<Camera variant="32x32_4" />} onClick={() => navigate('/photos')}>
                Photos
            </List.Item>
            <List.Item icon={<Mspaint variant="32x32_4" />} onClick={() => navigate('/ceramics')}>
                Clay
            </List.Item>
            <List.Item icon={<Mail variant="32x32_4" />} onClick={() => navigate('/contact')}>
                Contact
            </List.Item>
        </List>
    );

    return (
        <>
            <PageWrapper>
                <BackgroundLayer>
                    <SplitPixelBackground
                        photoLeft={photo1}
                        photoRight={photo2}
                        altLeft="Bryanna holding Poppi the cat"
                        altRight="Hawaii"
                    />
                </BackgroundLayer>
                <ClipArtBackLayer>
                    <ClipArt content={{ items: backItems }}/>
                </ClipArtBackLayer>
                <ForegroundLayer>
                    <Win95Portfolio/>
                </ForegroundLayer>
                <ClipArtFrontLayer>
                    <ClipArt content={{ items: frontItems }}/>
                </ClipArtFrontLayer>
            </PageWrapper>
            <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999 }}>
                <TaskBar className="win95-taskbar-bar" list={startMenu} />
            </div>
        </>
   );
};

export default HomePage;