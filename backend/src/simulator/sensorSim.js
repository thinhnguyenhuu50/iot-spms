/**
 * IoT Sensor Simulator
 *
 * Simulates physical parking sensors by generating random
 * "Car In / Car Out" events and sending them to the backend API.
 *
 * Usage: node src/simulator/sensorSim.js
 */

const API_URL = process.env.API_URL || 'http://localhost:5000';
const SENSOR_API_KEY = process.env.SENSOR_API_KEY || 'secret-sensor-key';
const INTERVAL_MS = 5000; // Send an event every 5 seconds

// Define simulated sensors (sensor_id maps to a physical slot)
const SENSORS = [
    'S-A1', 'S-A2', 'S-A3', 'S-A4', 'S-A5',
    'S-B1', 'S-B2', 'S-B3', 'S-B4', 'S-B5',
    'S-C1', 'S-C2', 'S-C3', 'S-C4', 'S-C5',
];

// Track local state to simulate realistic toggling
const sensorStates = {};
SENSORS.forEach((id) => {
    sensorStates[id] = Math.random() > 0.5 ? 'OCCUPIED' : 'FREE';
});

function getRandomSensor() {
    const index = Math.floor(Math.random() * SENSORS.length);
    return SENSORS[index];
}

function flipStatus(current) {
    return current === 'OCCUPIED' ? 'FREE' : 'OCCUPIED';
}

async function sendSensorUpdate(sensorId, status) {
    const payload = {
        sensor_id: sensorId,
        status,
        timestamp: new Date().toISOString(),
    };

    try {
        const response = await fetch(`${API_URL}/api/parking/sensors/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': SENSOR_API_KEY,
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();
        console.log(`[${new Date().toISOString()}] ${sensorId}: ${status}  →  ${response.status}`, data.message || '');
    } catch (err) {
        console.error(`[${new Date().toISOString()}] Failed to reach backend:`, err.message);
    }
}

// ── Main Loop ───────────────────────────────────────────
console.log('🔌 IoT Sensor Simulator started');
console.log(`   Target API: ${API_URL}`);
console.log(`   Sensors:    ${SENSORS.length}`);
console.log(`   Interval:   ${INTERVAL_MS}ms\n`);

setInterval(() => {
    const sensorId = getRandomSensor();
    const newStatus = flipStatus(sensorStates[sensorId]);
    sensorStates[sensorId] = newStatus;

    sendSensorUpdate(sensorId, newStatus);
}, INTERVAL_MS);
