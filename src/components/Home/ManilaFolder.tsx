import React, { useState } from "react";
import styled from "styled-components";
import bg from "../../assets/bryanna/Bryanna_Doll.png"
import {Button, Modal} from "@react95/core";


interface ManilaFolderProps {
  label?: string;
  onClick?: () => void;
  width?: number;
  height?: number;
}

const Wrapper = styled.div<{ $width: number; $height: number }>`
  position: relative;
  width: ${({ $width }) => $width}px;
  height: ${({ $height }) => $height}px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;

  &:focus-visible {
    outline: 3px solid rgba(77, 184, 216, 0.85);
    outline-offset: 6px;
    border-radius: 10px;
  }
`;

const Tab = styled.div<{ $open: boolean }>`
  position: absolute;
  top: 9%;
  left: 10%;
  width: 20%;
  height: 20%;
  background: #dba861;
  border-radius: 12px 12px 0 0;
  transform-origin: bottom center;
  z-index: 1;
`;

const Body = styled.div<{ $open: boolean }>`
  position: absolute;
  inset: 15% 7% 7% 7%;
  border-radius: 25px;
  background: linear-gradient(180deg, #f0cc86 0%, #e3b96f 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
  padding: 15px;
  transform: translateY(${({ $open }) => ($open ? -6 : 0)}px);
  box-shadow: 0 ${({ $open }) => ($open ? 20 : 10)}px
    ${({ $open }) => ($open ? 30 : 16)}px
    rgba(0, 0, 0, ${({ $open }) => ($open ? 0.3 : 0.18)});
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  z-index: 2;
`;

const PeekingFace: React.FC<{}> = () => (
  <Modal className="r95-light" style={{overflow: "hidden"}} title="BRYANNA'S PORTFOLIO" titleBarOptions={<Modal.Minimize />}>
    <Modal.Content>
    <div style={{display: "flex", alignItems: "center", justifyContent: "center", width: "400px", height: "250px", overflow: "hidden"}}>
      <img style={{ height: "250px", objectFit: "cover"}} src={bg} alt={"me! as a drawing"}/>
    </div>
    </Modal.Content>
  </Modal>
);

const ManilaFolder: React.FC<ManilaFolderProps> = ({
  label = "ENTER",
  onClick,
  width = 1000,
  height = 1000,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Wrapper
      role="button"
      tabIndex={0}
      $width={width}
      $height={height}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      aria-label={label}
    >
      <Tab $open={open} />
      <Body $open={open}>
          {/* Stop clicks inside the peeking modals from bubbling up and
              triggering the folder's navigation, so their own buttons work.
              Clicking the folder itself still enters. */}
          <div onClick={(e) => e.stopPropagation()} style={{ display: "contents" }}>
            <PeekingFace />
            <Modal className="r95-light" style={{minWidth: "13%"}} titleBarOptions={<Modal.Minimize />}>
                <Modal.Content >
                    <span style={{paddingBottom:"8px"}}>DO YOU LOVE CATS?</span>
                    <div>
                    <Button style={{marginRight: "10px"}}>YES</Button>
                    <Button>NO</Button>
                    </div>
                </Modal.Content>
            </Modal>
          </div>
      </Body>
    </Wrapper>
  );
};

export default ManilaFolder;
