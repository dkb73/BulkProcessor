require('dotenv').config();
const http = require('http'); 
const express = require('express');
const {Server} = require('socket.io');
const IORedis = require('ioredis');

const cors = require('cors');
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');
const fileRoutes = require('./src/routes/fileRoutes');
const jobRoutes = require('./src/routes/jobRoutes');
const salesRoutes = require('./src/routes/salesRoutes');

// --- Main App Initialization ---
const app = express();
const server = http.createServer(app);

// create scoket io server
const io = new Server(server,{
    cors:{
        origin:"http://localhost:5173",
        method:["GET","POST"]
    }
});

//seting up redis subscriber
const subscriber = new IORedis({
    host:process.env.REDIS_HOST,
    port:process.env.REDIS_PORT,
    maxRetriesPerRequest:null
})

// --- Connect to Database ---
connectDB();

// --- Middlewares ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// --- API Routes ---

// Mount the authentication routes on the '/api/auth' path
app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/jobs',jobRoutes);
app.use('/api/sales-data', salesRoutes); 


//subscriber to job-updates channel
subscriber.subscribe('job-updates',(err,count)=>{
    if(err){
        console.error('Failed to subscribe to redis channel',err);
        return;
    }
    console.log(`Subscribed to ${count} Redis channel(s). Listening for job updates...`);
})

//handle incoming msg from channel
//when worker will publish a message, this code will run.
//it takes msg and sends it to all connected browsers via socket.io
subscriber.on('message',(channel,message)=>{
    if(channel==='job-updates'){
        console.log("received job update from worker:",message);
        const update = JSON.parse(message);
        io.emit('job-update',update);
    }
})

io.on('connection', (socket) => {
  console.log('A user connected with socket ID:', socket.id);
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// --- Server Startup ---
const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
}); 