import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import apiRoutes from './routes/api.js';

const app = express();

// --------------- Middleware ---------------
const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',')
    : ['http://localhost:5173'];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));
app.use(express.json());
app.use(morgan('dev'));

// --------------- Routes ---------------
app.use('/api', apiRoutes);

// --------------- Health Check ---------------
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// --------------- Error Handler ---------------
app.use((err, _req, res, _next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        error: {
            message: err.message || 'Internal Server Error',
        },
    });
});

export default app;
