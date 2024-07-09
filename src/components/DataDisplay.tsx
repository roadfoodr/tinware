// Generated on 2024-07-08 at 12:40 PM EDT

import React, { useState, useEffect } from 'react';
import { getFromIndexedDB, clearCache } from '../services/DataInitializer';

const DataDisplay: React.FC = () => {
  const [topics, setTopics] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    const result: any = await getFromIndexedDB();
    if (result && result.data) {
      const allTopics = Array.from(new Set(result.data.map((item: any) => item.topic)));
      setTopics(['All Words', ...allTopics]);
    }
  };

  const handleTopicChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const topic = event.target.value;
    setSelectedTopic(topic);

    const result: any = await getFromIndexedDB();
    if (result && result.data) {
      let filteredData = result.data;
      if (topic !== 'All Words') {
        filteredData = filteredData.filter((item: any) => item.topic === topic);
      }
      setData(filteredData.slice(0, 10));
    }
  };

  const handleClearCache = async () => {
    await clearCache();
    setTopics([]);
    setSelectedTopic('');
    setData([]);
    fetchTopics();
  };

  return (
    <div className="pure-g">
      <div className="pure-u-1 pure-u-md-1-3">
        <select className="pure-input-1" value={selectedTopic} onChange={handleTopicChange}>
          <option value="">Select a topic</option>
          {topics.map((topic, index) => (
            <option key={index} value={topic}>
              {topic}
            </option>
          ))}
        </select>
      </div>

      {data.length > 0 && (
        <div className="pure-u-1">
          <table className="pure-table pure-table-bordered">
            <thead>
              <tr>
                {Object.keys(data[0]).map((header, index) => (
                  <th key={index}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {Object.values(row).map((value: any, colIndex) => (
                    <td key={colIndex}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="pure-u-1">
        <button className="pure-button pure-button-primary" onClick={handleClearCache}>Clear Cache</button>
      </div>
    </div>
  );
};

export default DataDisplay;
