import React from "react";
import { useNavigate } from "react-router-dom";
import PixelateImage from "../Background/PixelateImage.tsx";
import ManilaFolder from "./ManilaFolder.tsx";
import background from "../../assets/public/background/background.png";

const EnterPage: React.FC = () => {
    const navigate = useNavigate();

    const handleEnter = () => {
        navigate("/home");
    };

    return (
        <section style={{ position: "relative", width: "100%", height: "100vh" }}>
            <PixelateImage
                src={background}
                alt="background"
                width="100%"
                height="100vh"
                mode="oscillate"
                pixelMin={4}
                pixelMax={10}
                cycleDuration={160000}
                style={{ objectFit: "cover" }}
            />
            {/* Overlay */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "28px",
                    background: "rgba(168, 230, 240, 0.15)",
                }}
            >
                <ManilaFolder label="ENTER" onClick={handleEnter} width={1440} height={974} />
            </div>
        </section>
    );
};

export default EnterPage;
