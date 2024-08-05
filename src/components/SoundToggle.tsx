import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeUp, faVolumeMute } from '@fortawesome/free-solid-svg-icons';

interface SoundToggleProps {
  isSoundOn: boolean;
  onToggle: () => void;
}

const SoundToggle: React.FC<SoundToggleProps> = ({ isSoundOn, onToggle }) => {
  return (
    <button onClick={onToggle} className="sound-toggle">
      <FontAwesomeIcon icon={isSoundOn ? faVolumeUp : faVolumeMute} />
      {isSoundOn ? ' Sound On' : ' Sound Off'}
    </button>
  );
};

export default SoundToggle;