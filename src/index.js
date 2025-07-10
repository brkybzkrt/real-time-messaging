import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import { apiRoutes } from './routes/index.js';
import { responseMiddleware } from './middleware/response.middleware.js';
import initSocket from './socket/index.js';
import { setupSwagger } from './utils/swagger.js';
dotenv.config();


const app = express();
const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
initSocket(server);   

app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Apply response middleware
app.use(responseMiddleware);

// Setup Swagger
setupSwagger(app);

app.use('/api', apiRoutes);

const startServer = async () => {
    try {
      // Connect to database
      await connectDB();
      
      // Start server
      server.listen(PORT, () => {
        console.log(`Real-time messaging API is running at http://localhost:${PORT}`);
      });
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  };

startServer();