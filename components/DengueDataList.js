import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from './firebase';
import { Bar, Scatter } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement } from 'chart.js';
import CsvUploader from './CsvUploader';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement);

const buttonStyle = {
  padding: '8px 16px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px',
  margin: '0 5px',
  transition: 'background-color 0.3s, color 0.3s',
};

const editButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#28a745',
  color: '#fff',
};

const deleteButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#dc3545',
  color: '#fff',
};

const tableHeaderStyle = {
  backgroundColor: 'rgb(51, 51, 51)',
  color: '#fff',
};

const DengueDataList = () => {
  const [dengueData, setDengueData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    location: "",
    cases: "",
    deaths: "",
    date: "",
    regions: "",
  });

  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [chartType, setChartType] = useState("Bar Chart"); // New state for chart type
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of items per page

  useEffect(() => {
    const fetchData = async () => {
      const dengueCollection = collection(db, "dengueData");
      const dengueSnapshot = await getDocs(dengueCollection);
      const dataList = dengueSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      dataList.sort((a, b) => a.location.localeCompare(b.location));

      setDengueData(dataList);
      filterData(dataList, selectedMonth, selectedYear);
    };

    fetchData();
  }, [selectedMonth, selectedYear]);

  const filterData = (data, month, year) => {
    if (!month && !year) {
      setFilteredData(data);
      return;
    }
    const filtered = data.filter((item) => {
      const date = new Date(item.date);
      const itemMonth = date.getMonth() + 1;
      const itemYear = date.getFullYear();
      return (
        (month ? itemMonth === parseInt(month) : true) &&
        (year ? itemYear === parseInt(year) : true)
      );
    });
    setFilteredData(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleDelete = async (id) => {
    const dengueDocRef = doc(db, "dengueData", id);
    try {
      await deleteDoc(dengueDocRef);
      const updatedData = dengueData.filter((data) => data.id !== id);
      setDengueData(updatedData);
      filterData(updatedData, selectedMonth, selectedYear);
      alert("Data deleted successfully!");
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const handleEdit = (data) => {
    setEditingId(data.id);
    setEditForm({
      location: data.location,
      cases: data.cases,
      deaths: data.deaths,
      date: data.date,
      regions: data.regions,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const dengueDocRef = doc(db, "dengueData", editingId);
    try {
      await updateDoc(dengueDocRef, {
        location: editForm.location,
        cases: Number(editForm.cases),
        deaths: Number(editForm.deaths),
        date: editForm.date,
        regions: editForm.regions,
      });
      const updatedData = dengueData.map((data) =>
        data.id === editingId ? { id: editingId, ...editForm } : data
      );
      updatedData.sort((a, b) => a.location.localeCompare(b.location));
      setDengueData(updatedData);
      filterData(updatedData, selectedMonth, selectedYear);
      setEditingId(null);
      alert("Data updated successfully!");
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  // Prepare bar chart data
  const barChartData = {
    labels: filteredData.map(item => item.location),
    datasets: [
      {
        label: 'Cases',
        data: filteredData.map(item => item.cases),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Deaths',
        data: filteredData.map(item => item.deaths),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Prepare scatter plot data (Cases vs. Deaths)
  const scatterChartData = {
    datasets: [
      {
        label: 'Cases vs Deaths',
        data: filteredData.map(item => ({ x: item.cases, y: item.deaths })),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        pointRadius: 5,
      },
    ],
  };

  // Paginate data
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div>
      <h2 style={{ marginLeft: "130px" }}>Dengue Data List</h2>

      {/* CSV Uploader Section */}
      <CsvUploader />

      {/* Filter Section */}
      <div style={{ marginLeft: "150px", marginTop: "50px" }}>
        <input
          type="number"
          min="1"
          max="12"
          placeholder="Month (1-12)"
          value={selectedMonth}
          onChange={(e) => {
            setSelectedMonth(e.target.value);
            filterData(dengueData, e.target.value, selectedYear);
          }}
        />
        <input
          type="number"
          min="2000"
          max={new Date().getFullYear()}
          placeholder="Year"
          value={selectedYear}
          onChange={(e) => {
            setSelectedYear(e.target.value);
            filterData(dengueData, selectedMonth, e.target.value);
          }}
        />
      </div>

      {/* Dropdown to choose chart type */}
      <div style={{ margin: '20px auto', textAlign: 'center' }}>
        <label htmlFor="chart-type">Select Chart Type: </label>
        <select
          id="chart-type"
          value={chartType}
          onChange={(e) => setChartType(e.target.value)}
        >
          <option value="Bar Chart">Bar Chart</option>
          <option value="Scatter Plot">Scatter Plot</option>
        </select>
      </div>

      {/* Conditionally Render Chart */}
      <div style={{ width: '80%', margin: '20px auto' }}>
        {chartType === "Bar Chart" ? (
          <Bar
            data={barChartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                tooltip: {
                  callbacks: {
                    label: (tooltipItem) => `${tooltipItem.dataset.label}: ${tooltipItem.raw}`,
                  },
                },
              },
              scales: {
                x: {
                  stacked: true,
                },
                y: {
                  stacked: true,
                },
              },
            }}
          />
        ) : (
          <Scatter
            data={scatterChartData}
            options={{
              responsive: true,
              scales: {
                x: {
                  title: {
                    display: true,
                    text: 'Cases',
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: 'Deaths',
                  },
                },
              },
            }}
          />
        )}
      </div>

      {editingId ? (
        <form onSubmit={handleUpdate}>
          <input
            type="text"
            placeholder="Location"
            value={editForm.location}
            onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Cases"
            value={editForm.cases}
            onChange={(e) => setEditForm({ ...editForm, cases: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Deaths"
            value={editForm.deaths}
            onChange={(e) => setEditForm({ ...editForm, deaths: e.target.value })}
            required
          />
          <input
            type="date"
            value={editForm.date}
            onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Regions"
            value={editForm.regions}
            onChange={(e) => setEditForm({ ...editForm, regions: e.target.value })}
            required
          />
          <button type="submit" style={{ ...buttonStyle, backgroundColor: '#007bff', color: '#fff' }}>Update Data</button>
          <button onClick={() => setEditingId(null)} style={{ ...buttonStyle, backgroundColor: '#6c757d', color: '#fff' }}>Cancel</button>
        </form>
      ) : (
        <>
          <table
            border="1"
            cellPadding="10"
            style={{
              width: "70%",
              borderCollapse: "collapse",
              margin: "20px auto",
            }}
          >
            <thead style={tableHeaderStyle}>
              <tr>
                <th>Location</th>
                <th>Region</th>
                <th>Cases</th>
                <th>Deaths</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((data) => (
                  <tr key={data.id}>
                    <td>{data.location}</td>
                    <td>{data.regions}</td>
                    <td>{data.cases}</td>
                    <td>{data.deaths}</td>
                    <td>{data.date}</td>
                    <td>
                      <button
                        onClick={() => handleEdit(data)}
                        style={editButtonStyle}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(data.id)}
                        style={deleteButtonStyle}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No data available</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div style={{ textAlign: 'center', margin: '20px auto' }}>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              style={buttonStyle}
            >
              Previous
            </button>
            <span> Page {currentPage} of {totalPages} </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={buttonStyle}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default DengueDataList;
