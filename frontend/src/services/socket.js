import { io } from 'socket.io-client';

// This is the URL of our backend server.
const SERVER_URL = 'http://localhost:8000';

// Create and export the socket connection.
// This one line creates the connection to the backend.
const socket = io(SERVER_URL);

export default socket;