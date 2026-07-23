import React from "react";
import {useNavigate} from "react-router-dom";
import PixelateImage from "./Background/PixelateImage.tsx";
import background from "../../public/background/background.png";
interface HomePageProps {

}


const CurvedText: React.FC = () => (
    <svg viewBox="0 0 700 220" width="700" height="220">
        <defs>
            <path
                id="textCurve"
                //  {adjust this to change curve shape */}
                d="M 80,170 Q 350,30 620,170"
            />
        </defs>
        <text
            fill="white"
            fontSize="75"
            fontFamily="CustomFont, sans-serif"
            fontWeight="bold"
            filter = "drop-shadow(0px 2px 8px rgba(77, 184, 216, 0.6))"
        >
            <textPath href="#textCurve" startOffset="50%" textAnchor="middle">
                Bry Cheese
            </textPath>
        </text>
    </svg>
);

const HomePage: React.FC<HomePageProps> = ({}) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate('/home'); // Navigate to the Recipe page
    };

    return (<section style={{position: "relative", width: "100%", height: "100vh"}}>
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
            {/* Overlay*/}
            <div style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(168, 230, 240, 0.15)",
            }}>
                <CurvedText/>
                <p style={{
                color: "white",
                fontSize: "4rem",
                marginTop: "0px",
                cursor: "pointer",
                letterSpacing: "0.1em",
                textShadow: "0px 2px 12px rgba(77,184,216,0.8)",
                transition: "opacity 0.2s ease"}}
                   onClick={handleCardClick}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >ENTER</p>
            </div>
        </section>
    );
}

export default HomePage;