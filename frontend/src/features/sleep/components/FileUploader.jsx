import React, { useState } from 'react';
import { Upload, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Papa from 'papaparse';

const FileUploader = ({ onDataProcessed }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    setIsUploading(true);
    setError(null);
    
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        try {
          // Process the CSV data
          const processedData = processHealthData(results.data);
          onDataProcessed(processedData);
          setIsUploading(false);
        } catch (err) {
          console.error("Error processing data:", err);
          setError("Failed to process file. Please ensure it's a valid Apple Health export.");
          setIsUploading(false);
        }
      },
      error: (err) => {
        console.error("Error parsing CSV:", err);
        setError("Failed to read file. Please try again.");
        setIsUploading(false);
      }
    });
  };
  
  // Process the raw CSV data into usable format
  const processHealthData = (data) => {
    console.log("Raw data:", data[0]); // Log the first row to understand structure
    
    // Filter out rows with no sleep data
    const sleepData = data.filter(row => {
      // Check for common sleep data column names
      return (row['Total Sleep'] && row['Total Sleep'] !== 'NA') || 
             (row['Sleep Duration'] && row['Sleep Duration'] !== 'NA') ||
             (row['Sleep Analysis [Deep] (hr)'] && row['Sleep Analysis [Deep] (hr)'] !== 'NA');
    });
    
    if (sleepData.length === 0) {
      throw new Error("No sleep data found in the uploaded file");
    }
    
    console.log("Found sleep data rows:", sleepData.length);
    
    // Map to more usable structure
    return sleepData.map(row => ({
      date: new Date(row.Date || row.date || row['Start Date']),
      totalSleep: parseFloat(row['Total Sleep'] || row['Sleep Duration'] || 0),
      deepSleep: parseFloat(row['Sleep Analysis [Deep] (hr)'] || row['Deep Sleep'] || 0),
      coreSleep: parseFloat(row['Sleep Analysis [Core] (hr)'] || row['Core Sleep'] || 0),
      remSleep: parseFloat(row['Sleep Analysis [REM] (hr)'] || row['REM Sleep'] || 0),
      awakeDuring: parseFloat(row['Sleep Analysis [Awake] (hr)'] || row['Awake Time'] || 0),
      restingHeartRate: parseFloat(row['Resting Heart Rate (bpm)'] || row['Resting Heart Rate'] || 0),
      respiratoryRate: parseFloat(row['Respiratory Rate (count/min)'] || row['Respiratory Rate'] || 0),
      stepsCount: parseFloat(row['Step Count (steps)'] || row['Steps'] || 0),
      activeEnergy: parseFloat(row['Active Energy (kcal)'] || row['Active Energy'] || 0),
      wristTemperature: parseFloat(row['Apple Sleeping Wrist Temperature (ºF)'] || row['Wrist Temperature'] || 0)
    }));
  };

  return (
    <Card className="bg-white border-0 shadow-md">
      <CardContent className="p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
            <div className="flex">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span>{error}</span>
            </div>
          </div>
        )}
        
        <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
          <Upload className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">Upload Apple Health Data</h3>
          <p className="text-sm text-gray-500 mb-4 text-center max-w-md">
            Export your health data from the Apple Health app and upload the CSV file to view your sleep analytics
          </p>
          
          <input 
            type="file" 
            accept=".csv" 
            onChange={handleFileUpload}
            className="hidden" 
            id="file-upload" 
          />
          {/* Fixed button implementation */}
          <label htmlFor="file-upload">
            <div className="cursor-pointer">
              <Button 
                type="button"
                disabled={isUploading}
                className="bg-[#4D55CC] hover:bg-[#3c43a0]"
                onClick={() => document.getElementById('file-upload').click()}
              >
                {isUploading ? 'Processing...' : 'Select CSV File'}
              </Button>
            </div>
          </label>
        </div>
        
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">How to export Apple Health data:</h4>
          <ol className="text-xs text-gray-600 list-decimal pl-4 space-y-1">
            <li>Open the Health app on your iPhone</li>
            <li>Tap on your profile picture in the top right</li>
            <li>Scroll down and tap on "Export All Health Data"</li>
            <li>After export is complete, extract the CSV file from the zip</li>
            <li>Upload the sleep data CSV file here</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUploader;