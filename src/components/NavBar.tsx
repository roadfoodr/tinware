// Generated on 2024-07-08 at 13:15 PM EDT

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import Settings from './Settings';

interface NavBarProps {
  onRestart: () => void;
  onClearCache: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ onRestart, onClearCache }) => {
  return (
    <nav className="pure-menu pure-menu-horizontal pure-menu-fixed">
      <a href="#" className="pure-menu-heading pure-menu-link" onClick={onRestart} style={{
        fontFamily: '"Courier New", Courier, monospace',
        fontWeight: 'bold',
        fontSize: '24px',
      }}>TINWARE</a>
      <ul className="pure-menu-list" style={{ float: 'right' }}>
        <li className="pure-menu-item pure-menu-has-children pure-menu-allow-hover">
          <a href="#" className="pure-menu-link">
            <FontAwesomeIcon icon={faCog} /> Settings
          </a>
          <Settings onClearCache={onClearCache} />
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;