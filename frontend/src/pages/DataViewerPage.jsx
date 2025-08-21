import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Header from "../components/Header";
import { dataService } from "../services/api";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";

const DataViewerPage = () => {
  const [data, setData] = useState([]);
  const [paginationInfo, setPaginationInfo] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { token } = useSelector((state) => state.auth);

  // This useEffect hook will run when the component mounts,
  // and again anytime the 'currentPage' state changes.
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await dataService.getSalesData(currentPage, 20, token); // Fetch 20 records per page
        setData(response.data.data);
        setPaginationInfo(response.data.pagination);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to fetch data.");
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchData();
    }
  }, [currentPage, token]);

  if (isLoading) {
    return (
      <div>
        <Header />
        
        <p style={{ textAlign: "center", marginTop: "2rem" }}>
          Loading data...
          <CircularProgress />
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header />
        <p style={{ color: "red", textAlign: "center", marginTop: "2rem" }}>
          {error}
        </p>
      </div>
    );
  }

  console.log(paginationInfo.currentPage,paginationInfo.totalPages)

  return (
    <div>
      <Header />
      <main style={{ padding: "2rem" }}>
        <h1>View Processed Sales Data</h1>

      <div
          style={{
            marginTop: "1rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={paginationInfo.currentPage === 1}
          >
            Previous Page
          </Button>
          <span style={{ padding: "-1rem 1rem" }}>
            Page {paginationInfo.currentPage} of {paginationInfo.totalPages}
          </span>
          <Button
            variant="contained"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={paginationInfo.currentPage >= paginationInfo.totalPages}
          >
            Next Page
          </Button>
        </div>

        <TableContainer component={Paper} style={{ marginTop: "1rem" }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Country</TableCell>
                <TableCell>Item Type</TableCell>
                <TableCell align="right">Total Revenue</TableCell>
                <TableCell>Order Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((record) => (
                <TableRow
                  key={record.orderId}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {record.orderId}
                  </TableCell>
                  <TableCell>{record.country}</TableCell>
                  <TableCell>{record.itemType}</TableCell>
                  <TableCell align="right">
                    {record.totalRevenue.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {new Date(record.orderDate).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* --- Pagination Controls --- */}
        
      </main>
    </div>
  );
};

export default DataViewerPage;
