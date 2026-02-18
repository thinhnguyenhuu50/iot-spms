import app from './app.js';
import env from './config/env.js';

const PORT = env.port;

app.listen(PORT, () => {
    console.log(`\n🚀 IoT-SPMS Backend running on http://localhost:${PORT}`);
    console.log(`📡 Health check:  http://localhost:${PORT}/health`);
    console.log(`🔧 Environment:   ${env.nodeEnv}\n`);
});
