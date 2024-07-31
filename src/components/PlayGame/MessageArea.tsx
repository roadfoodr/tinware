// Generated on 2024-08-01 at 10:45 AM EDT

import React from 'react';
import { SuccessMessage, ErrorMessage, HintMessage } from '../../types/gameTypes';

interface MessageAreaProps {
  errorMessage: ErrorMessage | null;
  successMessage: SuccessMessage | null;
  hint: HintMessage | null;
  showHint: boolean;
}

const MessageArea: React.FC<MessageAreaProps> = ({ 
  errorMessage, 
  successMessage, 
  hint, 
  showHint
}) => {
  return (
    <div className="message-area">
      {showHint && hint && (
        <div className="hint-message" dangerouslySetInnerHTML={{ __html: hint.text }} />
      )}
      {errorMessage && (
        <div className="error-message">{errorMessage.text}</div>
      )}
      {successMessage && (
        <div 
          className={`success-message ${successMessage.class}`}
          dangerouslySetInnerHTML={{ __html: successMessage.text }}
        />
      )}
    </div>
  );
};

export default MessageArea;