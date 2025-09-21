# BulkProcessor  

A scalable CSV processing component designed to handle **large file uploads** efficiently, featuring **real-time progress tracking**, **background job queues**, and **persistent storage**.  

## 🌟 Features  
- **Scalable File Processing** – Handles large CSVs without blocking the server.
- **Real-Time Updates** – Users see live job progress.
- **Decoupled Architecture** – API server and worker processes run independently.
- **Error Handling** – Invalid rows are skipped and logged for debugging.

## 🔧 How It Works  
1. **File Upload**
   - Files are stored temporarily by the backend on server's disk-storage.  

2. **Job Queue**  
   - API Server creates a job and reliably enqueues it using **BullMQ**.  

3. **Worker Processing**  
   - A worker thread starts to consume enqueued job, a nodejs readable file stream is created and piped to csv-parser's transform stream, output of transform stream is stacked and on reaching a threshold it bulk updates them into **MongoDB**, saving i/o connection time.  

4. **Real-Time Updates**  
   - Workers publish progress updates to API server via **Redis pub/sub**.
   - The backend propagates updates to clients via **Socket.io**.  

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

## 📡 API Usage

All backend API requests should be made to `http://localhost:8000`.

### Upload a CSV File

-   **Description**: Uploads a CSV file for processing. A background job is created to handle it.
-   **Method**: `POST`
-   **URL**: `/api/files/upload`
-   **Body**: `multipart/form-data` with a `file` field containing the CSV file.
-   **Success Response (`200 OK`)**:
    ```json
    {
      "message": "File uploaded successfully",
      "jobId": "job-12345"
    }
    ```

### Get Job Status

-   **Description**: Retrieves the current status and progress of a processing job.
-   **Method**: `GET`
-   **URL**: `/api/jobs/:jobId`
-   **Success Response (`200 OK`)**:
    ```json
    {
      "jobId": "job-12345",
      "status": "in-progress",
      "progress": 50
    }
    ```

### Get Processed Data

-   **Description**: Retrieves the final processed data from the CSV file.
-   **Method**: `GET`
-   **URL**: `/api/sales-data`
-   **Success Response (`200 OK`)**:
    ```json
    [
      {
        "product": "Product A",
        "quantity": 100,
        "totalSales": 5000
      },
      {
        "product": "Product B",
        "quantity": 200,
        "totalSales": 10000
      }
    ]
    ```

---

## 🔧 Troubleshooting

### Common Issues

-   **Redis or MongoDB not running**:
    -   Ensure both services are running. To start them with Docker, use:
        ```bash
        docker run -d --name my-redis -p 6379:6379 redis:6.2-alpine
        docker run -d --name my-mongo -p 27017:27017 mongo:5.0
        ```

-   **Frontend not connecting to backend**:
    -   Verify the backend is running at `http://localhost:8000`.

-   **Job updates not appearing**:
    -   Confirm the Redis server is running and accessible by the backend.
