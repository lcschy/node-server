const https = require('https');
const fs = require('fs');

// Read SSL certificates
const privateKey = fs.readFileSync('keydocker.pem', 'utf8');
const certificate = fs.readFileSync('certdocker.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };

// Array to store information about active connections
const activeConnections = [];

// Create the HTTPS server
const server = https.createServer(credentials, (req, res) => {
  // Extract and log the request headers
  console.log('Request Headers:', req.headers);

  // Send a response back to the client
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello, World!');
});

// Event listener to handle new connections
server.on('connection', (socket) => {
  // Add the new connection to the activeConnections array
  activeConnections.push({
    id: socket.remoteAddress + ':' + socket.remotePort,
    timestamp: new Date(),
  });

  // Log the number of active connections and information about each connection
  console.log('New Connection:');
  console.log('Number of Active Connections:', activeConnections.length);
  console.log('Connection Information:', activeConnections);

  // Event listener to handle the end of a connection
  socket.on('close', () => {
    // Remove the closed connection from the activeConnections array
    activeConnections.splice(
      activeConnections.findIndex((conn) => conn.id === socket.remoteAddress + ':' + socket.remotePort),
      1
    );

    // Log the updated number of active connections and information about remaining connections
    console.log('Connection Closed:');
    console.log('Number of Active Connections:', activeConnections.length);
    console.log('Connection Information:', activeConnections);
  });
});

// Set the port on which the server will listen
const port = 6969;

// Start the server and listen on the specified port
server.listen(port, () => {
  console.log(`Server is listening on https://localhost:${port}`);
});
