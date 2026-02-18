import './Loader.css';

/**
 * Loading spinner component.
 */
export default function Loader({ size = 'md', text = '' }) {
    return (
        <div className={`loader loader--${size}`}>
            <div className="loader__spinner" />
            {text && <p className="loader__text">{text}</p>}
        </div>
    );
}
