import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PostProperty from './pages/PostProperty';
import Profile from './pages/Profile'; 
import AdminDashboard from './pages/AdminDashboard'; // 🔥 Admin page import

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null); // 🔥 User role check karne ke liye
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user'); // LocalStorage se user data nikala
    
    if (token) {
      setIsAuthenticated(true);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center font-black">Checking Auth...</div>;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Header ko user pass kiya taaki wo Admin link dikha sake */}
        <Header isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} user={user} />
        
        <Routes>
          <Route path="/" element={<Home />} />
          
          <Route 
            path="/login" 
            element={!isAuthenticated ? <Login setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/" />} 
          />
          <Route 
            path="/signup" 
            element={!isAuthenticated ? <Signup /> : <Navigate to="/" />} 
          />

          <Route 
            path="/profile" 
            element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} 
          />

          <Route 
            path="/post" 
            element={isAuthenticated ? <PostProperty /> : <Navigate to="/login" />} 
          />

          {/* 🔥 NEW ADMIN ROUTE: Baaki logic ko touch kiye bina add kiya gaya */}
          <Route 
            path="/admin" 
            element={isAuthenticated && user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;