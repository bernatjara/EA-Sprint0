import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import { config } from './config/config';
import Logging from './library/Logging';
import userRoutes from './routes/User';
import asignaturaRoutes from './routes/Asignatura';
import scheduleRoutes from './routes/Schedule';
import newsRoutes from './routes/News';
import chatRoutes from './routes/Chat';
import messageRoutes from './routes/Message';
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
    router.use('/chats', chatRoutes);
    router.use('/messages', messageRoutes);

    /* Healthcheck */
    router.get('/ping', (req, res, next) => res.status(200).json({ message: 'pong' }));

    /* Error handling */
    router.use((req, res, next) => {
        const error = new Error('not found');
        Logging.error(error);

        return res.status(404).json({ message: error.message });
    });

    const server = http.createServer(router);
    const io = new Server(server);

    const connectedUsers: { [room: string]: Set<string> } = {};

    io.on('connection', (socket) => {
        socket.on('join-room', (room) => {
            socket.join(room);
            if (!connectedUsers[room]) {
                connectedUsers[room] = new Set();
            }
            connectedUsers[room].add(socket.id);
            io.to(room).emit('connected-users', connectedUsers[room].size);
        });
        socket.on('message', (data) => {
            const { room, message } = data;
            io.to(room).emit('message', { sender: socket.id, message });
        });
        socket.on('disconnect', () => {
            for (const room in connectedUsers) {
                if (connectedUsers[room].has(socket.id)) {
                    connectedUsers[room].delete(socket.id);
                    io.to(room).emit('connected-users', connectedUsers[room].size);
                    break;
                }
            }
        });
    });

    server.listen(config.server.port, () => Logging.info(`Server is running on port ${config.server.port}.`));
};
