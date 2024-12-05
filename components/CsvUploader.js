import React, { useState } from 'react';
import { db } from './firebase'; // Import Firebase configuration
import { collection, addDoc } from 'firebase/firestore';

function CsvUploader() {
  const [csvFile, setCsvFile] = useState(null);

  const handleFileChange = (event) => {
    setCsvFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!csvFile) {
      alert("Please select a CSV file to upload.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target.result;
      const rows = text.split('\n');
      const data = [];

      // Parse CSV rows assuming columns: location, cases, deaths, date, regions
      rows.forEach((row, index) => {
        const columns = row.split(',');
        if (columns.length >= 5 && index > 0) { // Skip header row
          data.push({
            location: columns[0].trim(),
            cases: Number(columns[1].trim()),
            deaths: Number(columns[2].trim()),
            date: columns[3].trim(),
            regions: columns[4].trim(),
          });
        }
      });

      try {
        const batch = data.map(async (item) => {
          await addDoc(collection(db, 'dengueData'), item);
        });

        await Promise.all(batch);
        alert('CSV data uploaded successfully!');
      } catch (error) {
        console.error('Error uploading CSV data:', error);
      }
    };

    reader.readAsText(csvFile);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "50px",
      }}
    >
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        style={{
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          marginBottom: "20px",
          marginRight: "750px",
          marginTop: "-40px",
        }}
      />
      <button
        onClick={handleFileUpload}
        style={{
          padding: "10px 20px",
          backgroundColor: "rgb(51, 51, 51)",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          marginTop:"-60px",
          marginLeft: "-350px",
        }}
      >
        Upload CSV
      </button>
    </div>
  );
}

export default CsvUploader;
