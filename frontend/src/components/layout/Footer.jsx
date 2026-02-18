import './Footer.css';

export default function Footer() {
    return (
        <footer className="footer" id="main-footer">
            <p>© {new Date().getFullYear()} IoT-SPMS — Ho Chi Minh City University of Technology (HCMUT)</p>
        </footer>
    );
}
