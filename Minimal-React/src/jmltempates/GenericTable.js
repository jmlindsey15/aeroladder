import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Button,
  TextField
} from '@mui/material';

function GenericTable({ tableName }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortDirection, setSortDirection] = useState("asc"); // or "desc"
  const [sortColumn, setSortColumn] = useState(null);

  useEffect(() => {
    axios.get(`/api/table/${tableName}`)
      .then(response => {
        if (response.data.success) {
          setData(response.data.data);
        } else {
          setError(response.data.msg);
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [tableName]);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (column) => {
    const newDirection = sortDirection === "asc" ? "desc" : "asc";
    const sortedData = [...data].sort((a, b) => {
      if (a[column] > b[column]) return sortDirection === "asc" ? 1 : -1;
      if (a[column] < b[column]) return sortDirection === "asc" ? -1 : 1;
      return 0;
    });
    setData(sortedData);
    setSortDirection(newDirection);
    setSortColumn(column);
  };

const handleDeleteRow = (index) => {
    const recordId = data[index].id;  // Assuming your rows have an id field

    axios.delete(`/api/table/${tableName}/${recordId}`)
        .then(response => {
            if (response.data.success) {
                const newData = [...data];
                newData.splice(index, 1);
                setData(newData);
                // Optionally show a success message if required
            } else {
                // Handle the failure scenario
                console.error("Error deleting the record:", response.data.msg);
            }
        })
        .catch(error => {
            // Handle any errors from the request itself (like network issues)
            console.error("Network error or unhandled server error:", error.message);
        });
};

const filteredData = searchTerm
    ? data.filter(row => Object.values(row).some(val => (val ? val.toString().toLowerCase().includes(searchTerm.toLowerCase()) : false)))
    : data;


  const allColumns = [...new Set(data.flatMap(Object.keys))];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <TextField
        label="Search"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {allColumns.map(col => (
                <TableCell key={col} onClick={() => handleSort(col)}>
                  {col} {sortColumn === col && (sortDirection === "asc" ? "↑" : "↓")}
                </TableCell>
              ))}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {allColumns.map((col) => (
                  <TableCell key={col}>{row[col] || "-"}</TableCell>
                ))}
                <TableCell>
                  <Button onClick={() => handleDeleteRow(rowIndex)}>Delete</Button>
                  <Button>Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </div>
  );
}

export default GenericTable;
