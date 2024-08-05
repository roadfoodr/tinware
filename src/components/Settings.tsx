import React from 'react';
import { useAppSettings } from '../context/AppSettingsContext';
import SoundToggle from './SoundToggle';

interface SettingsProps {
  onClearCache: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onClearCache }) => {
  const { settings, updateSettings } = useAppSettings();

  const handleSoundToggle = () => {
    updateSettings({ isSoundOn: !settings.isSoundOn });
  };

  return (
    <ul className="pure-menu-children">
      <li className="pure-menu-item">
        <SoundToggle isSoundOn={settings.isSoundOn} onToggle={handleSoundToggle} />
      </li>
      <li className="pure-menu-item">
        <a href="#" className="pure-menu-link" onClick={onClearCache}>Clear Cache</a>
      </li>
    </ul>
  );
};

export default Settings;