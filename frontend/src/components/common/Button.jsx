import './Button.css';

/**
 * Reusable Button component.
 * @param {{ variant?: 'primary'|'secondary'|'danger', children, ...props }} props
 */
export default function Button({ variant = 'primary', children, className = '', ...props }) {
    return (
        <button className={`btn btn--${variant} ${className}`} {...props}>
            {children}
        </button>
    );
}
