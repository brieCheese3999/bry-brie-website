import React from "react";
import styled from 'styled-components';
import {useNavigate} from "react-router-dom";
import Sidebar from "./Sidebar.tsx";
import PixelateImage from "./PixelateImage.tsx";
import background from "../../public/background/background.png";

interface HomePageProps {

}


const AboutPage: React.FC<HomePageProps> = ({}) => {
    const navigate = useNavigate();


    return (<div>
        <Sidebar onNavigate={(page) => navigate(`/${page}`)} activePage={"home"}/>
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
    </div>);
};

export default AboutPage;