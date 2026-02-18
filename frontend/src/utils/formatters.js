/**
 * Utility Formatters
 *
 * Date and currency formatting for the Vietnamese locale.
 */

/**
 * Format a date string to DD/MM/YYYY HH:mm.
 * @param {string|Date} dateStr
 * @returns {string}
 */
export function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

/**
 * Format a number as Vietnamese Dong (VND).
 * @param {number} amount
 * @returns {string}
 */
export function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount);
}

/**
 * Format a duration in hours for display.
 * @param {number} hours
 * @returns {string}
 */
export function formatDuration(hours) {
    if (hours < 1) return 'Less than 1 hour';
    if (hours === 1) return '1 hour';
    return `${hours} hours`;
}
