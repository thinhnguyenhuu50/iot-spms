import './Sidebar.css';

export default function Sidebar({ children }) {
    return (
        <aside className="sidebar" id="main-sidebar">
            {children}
        </aside>
    );
}
