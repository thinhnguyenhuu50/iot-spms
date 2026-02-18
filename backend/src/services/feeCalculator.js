/**
 * Fee Calculator Service
 *
 * Calculates parking fees based on duration and user role.
 * Faculty members receive a 50% discount.
 * Students pay the standard rate.
 * Visitors pay a 20% surcharge.
 */

const ROLE_MULTIPLIERS = {
    student: 1.0,
    faculty: 0.5,
    staff: 0.7,
    visitor: 1.2,
};

/**
 * Calculate the parking fee.
 * @param {Date|string} entryTime - When the car entered.
 * @param {Date|string} exitTime  - When the car exited.
 * @param {number} hourlyRate     - Zone hourly rate in VND.
 * @param {string} userRole       - One of: student, faculty, staff, visitor.
 * @returns {{ durationHours: number, baseFee: number, discount: number, totalFee: number }}
 */
export function calculateFee(entryTime, exitTime, hourlyRate, userRole = 'student') {
    const entry = new Date(entryTime);
    const exit = new Date(exitTime);
    const durationMs = exit - entry;

    if (durationMs < 0) {
        throw new Error('Exit time cannot be before entry time');
    }

    // Round up to nearest hour (minimum 1 hour)
    const durationHours = Math.max(1, Math.ceil(durationMs / (1000 * 60 * 60)));
    const baseFee = durationHours * hourlyRate;
    const multiplier = ROLE_MULTIPLIERS[userRole] ?? 1.0;
    const totalFee = Math.round(baseFee * multiplier);
    const discount = baseFee - totalFee;

    return {
        durationHours,
        baseFee,
        discount,
        totalFee,
    };
}
