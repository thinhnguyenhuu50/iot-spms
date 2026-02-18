import './Input.css';

/**
 * Reusable Input component with label.
 */
export default function Input({ label, id, error, className = '', ...props }) {
    return (
        <div className={`input-group ${className}`}>
            {label && <label htmlFor={id} className="input-label">{label}</label>}
            <input id={id} className={`input-field ${error ? 'input-field--error' : ''}`} {...props} />
            {error && <span className="input-error">{error}</span>}
        </div>
    );
}
