import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import { config } from './config/config';
import Logging from './library/Logging';
import userRoutes from './routes/User';
import asignaturaRoutes from './routes/Asignatura';
import scheduleRoutes from './routes/Schedule';
import newsRoutes from './routes/News';
import chatRoutes from './routes/Room';
import { Server } from 'socket.io';

const router = express();

/* Connect to Mongo */
mongoose
    .connect(config.mongo.url, { retryWrites: true, w: 'majority' })
    .then(() => {
        Logging.info('Connected to mongoDB.');
        StartServer();
    })
    .catch((error) => {
        Logging.error('Unable to connect: ');
        Logging.error(error);
    });

/* Only start the server if Mongo Connects */
const StartServer = () => {
    router.use((req, res, next) => {
        /* Log the Request */
        Logging.info(`Incomming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

        res.on('finish', () => {
            /* Log the Response */
            Logging.info(`Incomming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}] - Status: [${res.statusCode}]`);
        });

        next();
    });

    router.use(express.urlencoded({ extended: true }));
    router.use(express.json());

    /* Rules of API */
    router.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*'); // The request can come from anywhere. If you put IPs it would be more private.
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

        if (req.method == 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
            return res.status(200).json({});
        }
        next();
    });

    /* Routes */
    router.use('/users', userRoutes);
    router.use('/asignaturas', asignaturaRoutes);
    router.use('/schedules', scheduleRoutes);
    router.use('/news', newsRoutes);
    router.use('/chat', chatRoutes);

    /* Healthcheck */
    router.get('/ping', (req, res, next) => res.status(200).json({ message: 'pong' }));

    /* Error handling */
    router.use((req, res, next) => {
        const error = new Error('not found');
        Logging.error(error);

        return res.status(404).json({ message: error.message });
    });

    http.createServer(router).listen(config.server.port, () => Logging.info(`Server is running on port ${config.server.port}.`));
    const server = http.createServer(router);
    const io = new Server(server);

    interface Message {
        userId: string;
        message: string;
        isReviewLink: boolean;
      }
      
      const messages: Record<string, Message[]> = {};// Almacena los mensajes por sala

    io.on('connection', (socket) => {
        Logging.info('A user connected');
    
        socket.on('join room', (data) => {
            const { userId, roomId } = data;
            socket.join(roomId);
            Logging.info(`User ${userId} joined room ${roomId}`);
    
            // Enviar mensajes existentes de la sala al usuario que acaba de unirse
            if (messages[roomId]) {
                messages[roomId].forEach((message) => {
                    socket.emit('chat message', message);
                });
            }
        });
    
        socket.on('chat message', (data) => {
            const { userId, message, roomId, isReviewLink } = data;
            Logging.info(`Message from ${userId} in room ${roomId}: ${message}`);
        
            // Almacenar el mensaje en la matriz de mensajes
            if (!messages[roomId]) {
                messages[roomId] = [];
            }
            messages[roomId].push({ userId, message, isReviewLink });
        
            // Emitir el mensaje a todos los usuarios en la sala
            io.to(roomId).emit('chat message', { userId, message, isReviewLink });
        });
        
    
        socket.on('leave room', (data) => {
            const { roomId } = data;
            socket.leave(roomId);
            Logging.info(`User ${socket.id} left room ${roomId}`);
        });
    
        socket.on('disconnect', () => {
            Logging.info('User disconnected');
        });
    });
    server.listen(config.server.port, () => {
        Logging.info(`Server is running on port ${config.server.port}`);
    });

};
