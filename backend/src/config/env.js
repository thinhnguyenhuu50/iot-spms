import dotenv from 'dotenv';

dotenv.config();

export default {
    port: process.env.PORT || 5000,
    apiUrl: process.env.API_URL || `http://localhost:${process.env.PORT || 5000}`,
    supabaseUrl: process.env.SUPABASE_URL || '',
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY || '',
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
    sensorApiKey: process.env.SENSOR_API_KEY || 'secret-sensor-key',
    nodeEnv: process.env.NODE_ENV || 'development',
};
