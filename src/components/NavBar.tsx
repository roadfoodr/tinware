// Generated on 2024-07-12 at 13:30 PM EDT

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import Settings from './Settings';
import TinwareLogo from '../assets/tinware-logo.svg';

interface NavBarProps {
  onRestart: () => void;
  onClearCache: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ onRestart, onClearCache }) => {
  return (
    <nav className="pure-menu pure-menu-horizontal pure-menu-fixed" style={{ height: '70px', padding: '10px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '20px' }}>
        <a href="#" onClick={onRestart} style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <img 
            src={TinwareLogo} 
            alt="Tinware Logo" 
            style={{ height: '75px', marginRight: '15px' }} 
          />
          <span 
            className="pure-menu-heading" 
            style={{
              fontFamily: '"Courier New", Courier, monospace',
              fontWeight: 'bold',
              fontSize: '24px',
              color: 'inherit',
            }}
          >
            TINWARE
          </span>
        </a>
      </div>
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