// Generated on 2024-07-08 at 14:15 PM EDT

import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { db } from '../db';

const CSV_URL = import.meta.env.VITE_REACT_APP_CSV_URL;

interface DataInitializerProps {
  onDataLoaded: () => void;
}

const DataInitializer: React.FC<DataInitializerProps> = ({ onDataLoaded }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCSV = async () => {
      try {
        const count = await db.wordList.count();

        if (count > 0) {
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
                await db.wordList.bulkAdd(result.data as any[]);
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

export const getFromIndexedDB = () => db.wordList.toArray();

export const clearCache = () => db.wordList.clear();

export { DataInitializer };