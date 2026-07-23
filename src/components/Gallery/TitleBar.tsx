import React from 'react';

export interface TitleBarProps {
    title: string;
    onMinimize?: () => void;
    onMaximize?: () => void;
    onClose?: () => void;
    small?: boolean;
}

export const TitleBar: React.FC<TitleBarProps> = ({ title, onMinimize, onMaximize, onClose, small }) => {
    return (
        <div className="win95-titlebar">
            <div className="win95-titlebar-icon" />
            <div className="win95-titlebar-text" style={small ? { fontSize: 11 } : undefined}>
                {title}
            </div>
            <div className="win95-titlebar-btns">
                {onMinimize && (
                    <button type="button" className="win95-tbtn win95-raised" title="Minimize" onClick={onMinimize}>
                        _
                    </button>
                )}
                {onMaximize && (
                    <button type="button" className="win95-tbtn win95-raised" title="Maximize" onClick={onMaximize}>
                        &#9633;
                    </button>
                )}
                {onClose && (
                    <button type="button" className="win95-tbtn win95-raised" title="Close" onClick={onClose}>
                        X
                    </button>
                )}
            </div>
        </div>
    );
};
