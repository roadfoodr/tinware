// Generated on 2024-07-08 at 13:20 PM EDT

import React from 'react';

interface SettingsProps {
  onClearCache: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onClearCache }) => {
  return (
    <ul className="pure-menu-children">
      <li className="pure-menu-item">
        <a href="#" className="pure-menu-link" onClick={onClearCache}>Clear Cache</a>
      </li>
    </ul>
  );
};

export default Settings;