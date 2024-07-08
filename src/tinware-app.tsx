import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';

const DB_NAME = 'TinwareDB';
const STORE_NAME = 'wordList';
// const CSV_URL = process.env.REACT_APP_CSV_URL;
const CSV_URL = import.meta.env.VITE_REACT_APP_CSV_URL;

const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      db.createObjectStore(STORE_NAME, { keyPath: 'id' });
    };
  });
};

const getFromIndexedDB = async () => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(STORE_NAME);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
};

const storeInIndexedDB = async (data) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put({ id: STORE_NAME, data: data, timestamp: Date.now() });
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};

const clearCache = async () => {
  const db = await openDB();
  const transaction = db.transaction(STORE_NAME, 'readwrite');
  const store = transaction.objectStore(STORE_NAME);
  await store.clear();
  console.log('Cache cleared');
};

const S3CSVLoader = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCSV = async () => {
      try {
        // console.log('Checking IndexedDB for cached data...');
        const cachedData = await getFromIndexedDB();
        // console.log('Cached data:', cachedData);

        if (cachedData && cachedData.data && cachedData.data.length > 0) {
          console.log('Using cached data');
          setData(cachedData.data);
          setIsLoading(false);
          return;
        }

        console.log('Fetching from S3');
        const response = await fetch(CSV_URL);
        const csvText = await response.text();
        
        Papa.parse(csvText, {
          complete: async (result) => {
            // console.log('Papa parse result:', result);
            if (result.data && result.data.length > 0) {
              setData(result.data);
              
              try {
                await storeInIndexedDB(result.data);
                // console.log('Data stored in IndexedDB');
              } catch (dbError) {
                console.error('Error storing data in IndexedDB:', dbError);
              }
            } else {
              setError('CSV file is empty or invalid');
            }
            setIsLoading(false);
          },
          error: (error) => {
            console.error('Papa parse error:', error);
            setError(`Failed to parse CSV: ${error.message}`);
            setIsLoading(false);
          },
          header: true,
          skipEmptyLines: true
        });
      } catch (err) {
        console.error('Fetch or process error:', err);
        setError(`Failed to fetch or process the CSV file: ${err.message}`);
        setIsLoading(false);
      }
    };

    fetchCSV();
  }, []);

  if (isLoading) return <div>Loading data...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data || data.length === 0) return <div>No data available</div>;


  // Early return if no data
  if (data.length === 0) return <div>No data available</div>;

  // Get column headers from the first row
  const headers = Object.keys(data[0]);

  return (
    <div>
      {/* <h3>Raw Data (first 3 rows):</h3>
      <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
        {JSON.stringify(data.slice(0, 3), null, 2)}
      </pre> */}

      <h1>Data Loaded: {data.length} rows</h1>
      <table style={{borderCollapse: 'collapse', width: '100%'}}>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index} style={{border: '1px solid black', padding: '8px'}}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.slice(0, 10).map((row, rowIndex) => (
            <tr key={rowIndex}>
              {headers.map((header, colIndex) => (
                <td key={colIndex} style={{border: '1px solid black', padding: '8px'}}>{row[header]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length > 10 && <p>Showing first 10 rows. {data.length - 10} more rows not displayed.</p>}

      <button onClick={clearCache}>Clear Cache</button>

    </div>
  );
};

export default S3CSVLoader;
