// Generated on 2024-07-08 at 14:45 PM EDT

import React from 'react';
import { WordItem } from '../db'; // Import the WordItem interface

interface PlayGameProps {
  data: WordItem[];
}

const PlayGame: React.FC<PlayGameProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <div>No data available for the selected topic.</div>;
  }

  const headers = Object.keys(data[0]);

  return (
    <div className="pure-g">
      <div className="pure-u-1">
        <table className="pure-table pure-table-bordered">
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {headers.map((header, colIndex) => (
                  <td key={colIndex}>{row[header as keyof WordItem]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlayGame;