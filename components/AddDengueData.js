import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";

const AddDengueData = () => {
  const [location, setLocation] = useState("");
  const [cases, setCases] = useState("");
  const [deaths, setDeaths] = useState("");
  const [date, setDate] = useState("");
  const [regions, setRegions] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "dengueData"), {
        location,
        cases: Number(cases),
        deaths: Number(deaths),
        date,
        regions,
      });
      setLocation("");
      setCases("");
      setDeaths("");
      setDate("");
      setRegions("");
      alert("Data added successfully!");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "300px",
        margin: "0 auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h1 style={{ textAlign: "center" }}>Add Dengue Data</h1>
      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        required
        style={{ padding: "10px", marginBottom: "10px", width: "100%" }}
      />
      <input
        type="number"
        placeholder="Cases"
        value={cases}
        onChange={(e) => setCases(e.target.value)}
        required
        style={{ padding: "10px", marginBottom: "10px", width: "100%" }}
      />
      <input
        type="number"
        placeholder="Deaths"
        value={deaths}
        onChange={(e) => setDeaths(e.target.value)}
        required
        style={{ padding: "10px", marginBottom: "10px", width: "100%" }}
      />
      <input
        type="date"
        placeholder="Date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
        style={{ padding: "10px", marginBottom: "10px", width: "100%" }}
      />
      <input
        type="text"
        placeholder="Regions"
        value={regions}
        onChange={(e) => setRegions(e.target.value)}
        required
        style={{ padding: "10px", marginBottom: "10px", width: "100%" }}
      />
      <button
        type="submit"
        style={{
          padding: "10px",
          backgroundColor: "rgb(51, 51, 51)",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          width: "100%",
        }}
      >
        Add Data
      </button>
    </form>
  );
};

export default AddDengueData;
