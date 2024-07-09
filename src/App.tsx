// Generated on 2024-07-08 at 12:45 PM EDT

import React, { useState } from 'react';
import NavBar from './components/NavBar';
import { DataInitializer } from './services/DataInitializer';
import DataDisplay from './components/DataDisplay';

const App: React.FC = () => {
  const [dataLoaded, setDataLoaded] = useState(false);

  return (
    <div className="pure-g">
      <div className="pure-u-1">
        <NavBar />
      </div>
      <div className="pure-u-1" style={{ marginTop: '50px' }}>
        <DataInitializer onDataLoaded={() => setDataLoaded(true)} />
      </div>
      {dataLoaded && (
        <div className="pure-u-1">
          <DataDisplay />
        </div>
      )}
    </div>
  );
};

export default App;
