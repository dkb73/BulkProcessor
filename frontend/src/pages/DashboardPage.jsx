import React from "react";
import Header from "../components/Header";
import FileUpload from "../components/FileUpload";
import JobList from "../components/JobList";
import { Stack } from "@mui/material";
import { Container } from "@mui/material";
const DashboardPage = () => {
  return (
    <div>
      <Header />
      <main>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Stack spacing={4}>
            <FileUpload />
            <JobList />
          </Stack>
        </Container>
      </main>
    </div>
  );
};

export default DashboardPage;
