import React from "react";
import styled from 'styled-components';
import PixelateImage from "../Background/PixelateImage.tsx";
import background from "../../../public/background/background.png";
import Win95Portfolio from "./Win95Portfolio.tsx";
import {ClipArt} from "../Background/BackgroundClipArt.tsx";
import {defaultClipArt} from "../data.ts";
import type {ClipArtContent} from "../types.ts";
import {TaskBar} from "@react95/core";

interface HomePageProps {
    content: ClipArtContent;
}

const PageWrapper = styled.div`
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
`;

const BackgroundLayer = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
`;

const ForegroundLayer = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

const ClipArtLayer = styled.div`
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
`;

const HomePage: React.FC<HomePageProps> = ({ content = defaultClipArt }) => {
    return (
        <>
            <PageWrapper>
                <BackgroundLayer>
                    <PixelateImage
                        src={background}
                        alt="background"
                        width="100%"
                        height="100%"
                        mode="oscillate"
                        pixelMin={15}
                        pixelMax={25}
                        cycleDuration={160000}
                        style={{objectFit: "cover"}}
                    />
                </BackgroundLayer>
                <ForegroundLayer>
                    <Win95Portfolio/>
                </ForegroundLayer>
                <ClipArtLayer>
                    <ClipArt content={content}/>
                </ClipArtLayer>
            </PageWrapper>
            <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999 }}>
                <TaskBar />
            </div>
        </>
   );
};

export default HomePage;