import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ParkingProvider } from './context/ParkingContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Admin from './pages/Admin';
import History from './pages/History';

export default function App() {
  return (
    <AuthProvider>
      <ParkingProvider>
        <Router>
          <div className="app">
            <Navbar />
            <main className="app__main">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/history" element={<History />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </ParkingProvider>
    </AuthProvider>
  );
}
