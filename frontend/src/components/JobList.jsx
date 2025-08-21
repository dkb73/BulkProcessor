import React from 'react';
import { useSelector } from 'react-redux';
import JobItem from './JobItem';
import { Typography, Box, Stack } from '@mui/material';

const JobList = () => {
  // Get the list of jobs from our Redux store
  const { jobList } = useSelector((state) => state.jobs);

  if (jobList.length === 0) {
    return (
      <div style={{ padding: '2rem', margin: '2rem', textAlign: 'center' }}>
        <h2>My Jobs</h2>
        <p>You haven't uploaded any files yet.</p>
      </div>
    );
  }

  return (
    <Box sx={{ mt: 4 }}> {/* Box for margin-top */}
      <Typography variant="h5" component="h2" gutterBottom>
        My Jobs
      </Typography>
      {jobList.length === 0 ? (
        <Typography sx={{ textAlign: 'center', color: 'text.secondary', mt: 3 }}>
          You haven't uploaded any files yet.
        </Typography>
      ) : (
        <Stack spacing={2}> {/* Stack for vertical spacing between jobs */}
          {jobList.map((job) => (
            <JobItem key={job.id} job={job} />
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default JobList;