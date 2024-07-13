// Generated on 2024-07-13 at 23:15 PM EDT

import React from 'react';
import { SuccessMessage, ErrorMessage, HintMessage } from '../../types/gameTypes';

interface MessageAreaProps {
  errorMessage: ErrorMessage | null;
  successMessage: SuccessMessage | null;
  hint: HintMessage | null;
  showHint: boolean;
}

const MessageArea: React.FC<MessageAreaProps> = ({ errorMessage, successMessage, hint, showHint }) => {
  if (errorMessage) {
    return <div className="error-message">{errorMessage.text}</div>;
  }

  if (successMessage) {
    // Check if the message contains the root word
    if (successMessage.text.includes('There are no letters that can go')) {
      const parts = successMessage.text.split(' ');
      const rootIndex = parts.length - 1;
      return (
        <div className={`success-message ${successMessage.class}`}>
          {parts.slice(0, rootIndex).join(' ')}{' '}
          <span className="root">{parts[rootIndex]}</span>
        </div>
      );
    }
    return <div className={`success-message ${successMessage.class}`}>{successMessage.text}</div>;
  }

  if (showHint && hint) {
    return <div className="hint-message">Hint: {hint.text}</div>;
  }

  return null;
};

export default MessageArea;