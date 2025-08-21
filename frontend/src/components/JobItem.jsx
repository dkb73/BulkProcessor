import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateJob } from '../features/jobs/jobsSlice';
import { jobService } from '../services/api';
import socket from '../services/socket';
import { Button, LinearProgress, Paper, Typography, Box, Stack } from '@mui/material';

const JobItem = ({ job }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(null);

  useEffect(() => {
    const handleJobUpdate = (data) => {
      if (data.jobId === job.id) {
        dispatch(
          updateJob({
            jobId: data.jobId,
            status: data.status,
            progress: data.progress,
            processedCount: data.processedCount,
            errorCount: data.errorCount,
          })
        );
      }
    };
    socket.on('job-update', handleJobUpdate);
    return () => {
      socket.off('job-update', handleJobUpdate);
    };
  }, [job.id, dispatch]);

  const handleDownload = async () => {
    setIsDownloading(true);
    setDownloadError(null);
    try {
        await jobService.downloadErrorReport(job.id, token);
    } catch (error) {
        setDownloadError('Failed to download report.');
    } finally {
        setIsDownloading(false);
    }
  }

  const isJobFinished = job.status === 'completed' || job.status === 'completed_with_errors' || job.status === 'failed';
  const progressValue = job.progress?.processed || 0;
  const progressTotal = job.progress?.total || 1;
  const progressPercent = job.progress?.total > 0 ? (job.progress.processed / job.progress.total) * 100 : 0;
  console.log("progressValue, progressTotal:",progressValue, progressTotal);

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack spacing={1}>
        <Typography variant="body1"><strong>File:</strong> {job.originalFilename}</Typography>
        <Typography variant="body2"><strong>Status:</strong> {job.status.replace('_', ' ')}</Typography>
        
        {(job.status === 'active' || (isJobFinished && job.progress)) && (
          <Box sx={{ width: '100%', mt: 1 }}>
            <LinearProgress variant="determinate" value={progressPercent} />
            <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
              {job.progress.processed} / {job.progress.total} rows processed
            </Typography>
          </Box>
        )}
        
        {isJobFinished && job.processedCount !== undefined && (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Successfully processed: {job.processedCount} | Errors: {job.errorCount}
          </Typography>
        )}

        {job.status === 'completed_with_errors' && (
          <Box sx={{ mt: 1 }}>
            <Button variant="contained" size="small" onClick={handleDownload} disabled={isDownloading}>
              {isDownloading ? 'Downloading...' : 'Download Error Report'}
            </Button>
            {downloadError && <Typography color="error" variant="caption" sx={{ mt: 1 }}>{downloadError}</Typography>}
          </Box>
        )}
      </Stack>
    </Paper>
  );
};

export default JobItem;