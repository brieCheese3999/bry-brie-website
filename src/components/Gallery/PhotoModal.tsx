// src/components/PhotoModal.tsx
import React from 'react';
import {Frame, Modal} from "@react95/core";
import type { ModalDefaultPosition } from "@react95/core";

interface PhotoModalProps {
    id: string;
    title: string;
    alt?: string;
    image: string;
    dragOptions: {
        defaultPosition: ModalDefaultPosition;
    };
    onExpand?: () => void;
}

export const PhotoModal: React.FC<PhotoModalProps> = ({ id, title, alt, image, dragOptions , onExpand}) => {
    return (
        <Modal width="297px" minHeight="448px" id={id} title={title} titleBarOptions={<Modal.Minimize />}  dragOptions={dragOptions}>
            <Modal.Content boxShadow="$in" bgColor="white" p="16px">
                <Frame as="div" display="flex" flexDirection="column" gap="8px">
                    <img src={image} alt={alt ?? "Photo"} onClick={onExpand}/>
                </Frame>
            </Modal.Content>
        </Modal>
    );
};

