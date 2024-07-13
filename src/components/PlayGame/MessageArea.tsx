// Generated on 2024-07-14 at 11:30 AM EDT

import React from 'react';
import { SuccessMessage, ErrorMessage, HintMessage } from '../../types/gameTypes';

interface MessageAreaProps {
  errorMessage: ErrorMessage | null;
  successMessage: SuccessMessage | null;
  hint: HintMessage | null;
  showHint: boolean;
}

const MessageArea: React.FC<MessageAreaProps> = ({ errorMessage, successMessage, hint, showHint }) => {
  return (
    <div className="message-area">
      {showHint && hint && (
        <div className="hint-message">Hint: {hint.text}</div>
      )}
      {errorMessage && (
        <div className="error-message">{errorMessage.text}</div>
      )}
      {successMessage && (
        <div className={`success-message ${successMessage.class}`}>
          {successMessage.text.includes('There are no letters that can go') ? (
            <>
              {successMessage.text.split(' ').slice(0, -1).join(' ')}{' '}
              <span className="root">{successMessage.text.split(' ').pop()}</span>
            </>
          ) : (
            successMessage.text
          )}
        </div>
      )}
    </div>
  );
};

export default MessageArea;