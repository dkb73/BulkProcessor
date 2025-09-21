# BulkProcessor  

A scalable CSV processing application designed to handle **large file uploads** efficiently with **real-time progress tracking**, **background job queues**, and **persistent storage**.  

## 🌟 Features  
- **Scalable File Processing** – Handles large CSVs without blocking the server.  
- **Real-Time Updates** – Users see live job progress.  
- **Decoupled Architecture** – API server and worker processes run independently.  
- **Error Handling** – Invalid rows are skipped and logged for debugging.  

## 🔧 How It Works  
1. **File Upload**  
   - Users upload CSV files via the frontend.  
   - Files are stored temporarily by the backend.  

2. **Job Queue**  
   - A job is created using **BullMQ** and pushed into a **Redis-backed queue**.  

3. **Worker Processing**  
   - A worker consumes jobs, parses CSV data, and stores processed results in **MongoDB**.  

4. **Real-Time Updates**  
   - Workers publish progress updates to **Redis**.  
   - The backend broadcasts updates to clients via **Socket.io**.  

5. **Data Retrieval**  
   - Users fetch processed data via the API or view it directly in the frontend.  

## 🚀 Quick Start  

### Prerequisites  
- [Docker Desktop](https://www.docker.com/products/docker-desktop) installed and running  
- [Node.js](https://nodejs.org/) & npm installed  
- [MongoDB](https://www.mongodb.com/) running locally or in Docker  
- [Redis](https://redis.io/) running locally or in Docker  

### 1. Clone & Navigate  

```bash
git clone https://github.com/dkb73/BulkProcessor
cd BulkProcessor
```

### 2. Install Dependencies

Backend
```bash
cd backend
npm install
```

Frontend
```bash
cd ../frontend
npm install
```

### 3. Start the System

Backend
```bash
cd backend
node index.js
```

Frontend
```bash
cd ../frontend
npm run dev
```

### 4. Verify

Backend → http://localhost:8000
Frontend → http://localhost:5173

