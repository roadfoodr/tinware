// Generated on 2024-07-28 at 15:00 PM EDT
/// <reference types="vite/client" />

import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import CryptoJS from 'crypto-js';
import { db, WordItem } from '../db';

declare global {
  interface ImportMetaEnv {
    VITE_REACT_APP_CSV_URL: string;
    VITE_REACT_APP_ENCRYPTION_KEY: string;
  }
}

const CSV_URL = import.meta.env.VITE_REACT_APP_CSV_URL;
const ENCRYPTION_KEY = import.meta.env.VITE_REACT_APP_ENCRYPTION_KEY;

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
        let csvText: string;

        if (CSV_URL.endsWith('.enc')) {
          const encryptedData = await response.arrayBuffer();
          csvText = await decryptData(encryptedData);
        } else {
          csvText = await response.text();
        }
        
        Papa.parse(csvText, {
          complete: async (result: Papa.ParseResult<WordItem>) => {
            if (result.data && result.data.length > 0) {
              try {
                // Ensure scenarioID is present in each row
                const processedData = result.data.map(item => ({
                  ...item,
                  scenarioID: item.scenarioID || `${item.subtopic}-${item.root}` // Fallback if scenarioID is missing
                }));
                await db.wordList.bulkAdd(processedData);
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
          error: (error: Error) => {
            console.error('Papa parse error:', error);
            setError(`Failed to parse CSV: ${error.message}`);
            setIsLoading(false);
          },
          header: true,
          skipEmptyLines: true,
          transform: (value, field) => {
            // Convert 'TRUE' and 'FALSE' strings to boolean for canAddS field
            if (field === 'canAddS') {
              return value.toUpperCase() === 'TRUE';
            }
            return value;
          }
        });
      } catch (err: unknown) {
        console.error('Fetch or process error:', err);
        setError(`Failed to fetch or process the CSV file: ${err instanceof Error ? err.message : String(err)}`);
        setIsLoading(false);
      }
    };

    fetchCSV();
  }, [onDataLoaded]);

  const decryptData = async (encryptedData: ArrayBuffer): Promise<string> => {
    try {
      const encryptedWords = CryptoJS.lib.WordArray.create(encryptedData);
      const iv = CryptoJS.lib.WordArray.create(encryptedWords.words.slice(0, 4));
      const ciphertext = CryptoJS.lib.WordArray.create(encryptedWords.words.slice(4));

      const decrypted = CryptoJS.AES.decrypt(
        { ciphertext: ciphertext } as CryptoJS.lib.CipherParams,
        CryptoJS.enc.Base64.parse(ENCRYPTION_KEY),
        { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
      );

      return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Decryption failed:', error);
      throw error;
    }
  };

  if (isLoading) return <div className="pure-u-1 pure-u-md-1-3">Loading data...</div>;
  if (error) return <div className="pure-u-1 pure-u-md-1-3">Error: {error}</div>;
  return null;
};

export const getFromIndexedDB = () => db.wordList.toArray();

export const clearCache = () => db.wordList.clear();

export { DataInitializer };