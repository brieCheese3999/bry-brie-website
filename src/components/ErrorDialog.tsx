import React from 'react';
import { TitleBar } from './TitleBar';

export interface ErrorDialogProps {
  visible: boolean;
  onDismiss: () => void;
  message?: string;
}

export const ErrorDialog: React.FC<ErrorDialogProps> = ({ visible, onDismiss, message = 'Fail' }) => {
  if (!visible) return null;

  return (
    <div className="win95-error-overlay">
      <div className="win95-error-dialog">
        <TitleBar title="Error" onClose={onDismiss} small />
        <div className="win95-error-body">
          <div className="win95-error-icon">!</div>
          <div>{message}</div>
        </div>
        <div className="win95-error-ok-row">
          <button type="button" className="win95-error-ok win95-raised" onClick={onDismiss}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
};
