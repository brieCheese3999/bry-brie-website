import React from "react";
import styled from 'styled-components';
import {useNavigate} from "react-router-dom";
import PixelateImage from "./PixelateImage.tsx";
import background from "../../public/background/background.png";
import Win95Portfolio from "./Win95Portfolio.tsx";
interface HomePageProps {

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
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

const HomePage: React.FC<HomePageProps> = ({}) => {
    return (
        <PageWrapper>
            <BackgroundLayer>
                <PixelateImage
                    src={background}
                    alt="background"
                    width="100%"
                    height="100vh"
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
        </PageWrapper>
   );
};

export default HomePage;