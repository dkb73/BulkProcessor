import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // This array will hold all the jobs the user has submitted
  jobList: [],
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
};

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    // Action to add a new job to the top of the list
    addJob: (state, action) => {
      const newJob = { 
        ...action.payload, 
        processedCount: 0, 
        errorCount: 0 
      };
      state.jobList.unshift(newJob); // unshift adds to the beginning
    },
    // Action to update the status and progress of an existing job
    updateJob: (state, action) => {
      const { jobId, ...updateData } = action.payload;
      const existingJob = state.jobList.find((job) => job.id === jobId);
      if (existingJob) {
        Object.assign(existingJob, updateData);
      }
    },
  },
});

export const { addJob, updateJob } = jobsSlice.actions;

export default jobsSlice.reducer;