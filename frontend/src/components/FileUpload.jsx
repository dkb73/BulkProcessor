import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { jobService } from '../services/api';
import { addJob } from '../features/jobs/jobsSlice';
import TextField from '@mui/material/TextField';
import toast from 'react-hot-toast';
import { Button, Typography, Paper, Stack, CircularProgress } from '@mui/material';

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  // Get the auth token from the Redux store
  const { token } = useSelector((state) => state.auth);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select a file first.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await jobService.uploadFile(selectedFile, token);
      const { jobId } = response.data;

      // Dispatch an action to add the new job to our Redux store
      dispatch(
        addJob({
          id: jobId,
          originalFilename: selectedFile.name,
          status: 'queued', // The initial status
          progress: 0,
        })
      );
      toast.success('Your file is now being processed!');
      // Reset the form
      setSelectedFile(null);
      e.target.reset(); // This clears the file input field
    } catch (err) {
      console.error('File upload failed:', err);
      toast.error('File upload failed! Please try again.')
      setError(err.response?.data?.message || 'File upload failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 4 }}> {/* Use Paper for a card-like effect */}
      <Typography variant="h5" component="h2" gutterBottom>
        Upload a New CSV File
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack direction="row" spacing={2} alignItems="center"> {/* Stack for easy horizontal layout */}
          <Button variant="outlined" component="label">
            Choose File
            <input type="file" hidden accept=".csv" onChange={handleFileChange} />
          </Button>
          {selectedFile && <Typography>{selectedFile.name}</Typography>}
          <Button
            variant="contained"
            type="submit"
            disabled={isLoading || !selectedFile}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isLoading ? 'Uploading...' : 'Upload'}
          </Button>
        </Stack>
      </form>
    </Paper>
  );
};

export default FileUpload;