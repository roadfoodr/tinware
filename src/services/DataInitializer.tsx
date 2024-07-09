// Generated on 2024-07-08 at 12:35 PM EDT

import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';

const DB_NAME = 'TinwareDB';
const STORE_NAME = 'wordList';
const CSV_URL = import.meta.env.VITE_REACT_APP_CSV_URL;

const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      db.createObjectStore(STORE_NAME, { keyPath: 'id' });
    };
  });
};

const getFromIndexedDB = async () => {
  const db: any = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(STORE_NAME);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
};

const storeInIndexedDB = async (data: any) => {
  const db: any = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put({ id: STORE_NAME, data: data, timestamp: Date.now() });
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
};

const clearCache = async () => {
  const db: any = await openDB();
  const transaction = db.transaction(STORE_NAME, 'readwrite');
  const store = transaction.objectStore(STORE_NAME);
  await store.clear();
  console.log('Cache cleared');
};

interface DataInitializerProps {
  onDataLoaded: () => void;
}

const DataInitializer: React.FC<DataInitializerProps> = ({ onDataLoaded }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCSV = async () => {
      try {
        const cachedData = await getFromIndexedDB();

        if (cachedData && cachedData.data && cachedData.data.length > 0) {
          console.log('Using cached data');
          setIsLoading(false);
          onDataLoaded();
          return;
        }

        console.log('Fetching from S3');
        const response = await fetch(CSV_URL);
        const csvText = await response.text();
        
        Papa.parse(csvText, {
          complete: async (result) => {
            if (result.data && result.data.length > 0) {
              try {
                await storeInIndexedDB(result.data);
                console.log('Data stored in IndexedDB');
                onDataLoaded();
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
      } catch (err: any) {
        console.error('Fetch or process error:', err);
        setError(`Failed to fetch or process the CSV file: ${err.message}`);
        setIsLoading(false);
      }
    };

    fetchCSV();
  }, [onDataLoaded]);

  if (isLoading) return <div className="pure-u-1 pure-u-md-1-3">Loading data...</div>;
  if (error) return <div className="pure-u-1 pure-u-md-1-3">Error: {error}</div>;
  return null;
};

export { DataInitializer, getFromIndexedDB, clearCache };
