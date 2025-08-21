import axios from 'axios'

const apiClient = axios.create({
    baseURL : 'http://localhost:8000/api'
})

export const authService = {
    login:(email,password)=>{
        return apiClient.post('/auth/login',{email,password});
    },
    register:(name,email,password)=>{
        return apiClient.post('/auth/register',{name,email,password});
    },
    getMe:(token)=>{
      return apiClient.get('/auth/me',{
        headers:{
          Authorization:`Bearer ${token}`
        }
      });
    }
};

export const jobService = {
  uploadFile: (file, token) => {
    // For file uploads, we need to use FormData
    const formData = new FormData();
    formData.append('csv', file); // 'csv' must match the key our backend expects

    return apiClient.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        // We must include the Authorization token for this protected route
        Authorization: `Bearer ${token}`,
      },
    });
  },
  getJobStatus: (jobId, token) => {
    return apiClient.get(`/jobs/${jobId}/status`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  downloadErrorReport: async (jobId, token) => {
    try {
      const response = await apiClient.get(`/jobs/${jobId}/error-report`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob', // Important: This tells Axios to expect a file blob
      });
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      // Create a temporary link element to trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `error-report-job-${jobId}.csv`);
      document.body.appendChild(link);
      link.click();
      // Clean up the temporary link and URL
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
        console.error("Failed to download error report", error);
        // We can re-throw the error to be handled by the component
        throw error;
    }
  },
};

export const dataService = {
  getSalesData: (page, limit, token) => {
    // We pass page and limit as query parameters to the backend
    return apiClient.get(`/sales-data?page=${page}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};