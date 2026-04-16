import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, PlusCircle, ChevronRight, ShieldCheck, LayoutGrid } from 'lucide-react';
import { useEffect } from 'react';

const Header = ({ isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();
  
  const user = JSON.parse(localStorage.getItem('user'));
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';
  const isAdmin = user?.role === 'admin';

  // 🔄 UNIVERSAL AUTO RELOAD LOGIC
  // Jaise hi user login hoga (isAuthenticated: true), page ek baar reload hoga
  useEffect(() => {
    if (isAuthenticated) {
      const hasReloaded = sessionStorage.getItem('pageReloaded');
      
      if (!hasReloaded) {
        sessionStorage.setItem('pageReloaded', 'true');
        window.location.reload();
      }
    } else {
      // Logout hone par flag remove kar dena taaki next login pe fir se reload ho
      sessionStorage.removeItem('pageReloaded');
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('pageReloaded'); // Reset flag on logout
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <nav className="flex justify-between items-center px-4 md:px-10 py-3 bg-white/90 backdrop-blur-md shadow-sm border-b sticky top-0 z-[100]">
      
      {/* 1. Brand Logo */}
      <Link to="/" className="flex items-center gap-2.5 group">
        <div className="bg-blue-600 p-2 rounded-xl group-hover:scale-110 transition-transform shadow-lg shadow-blue-100">
          <LayoutGrid className="text-white" size={20} />
        </div>
        <span className="text-2xl font-black tracking-tighter text-gray-900">
          RealEstate<span className="text-blue-600">App</span>
        </span>
      </Link>
      
      <div className="flex gap-4 items-center">
        {isAuthenticated ? (
          <>
            {/* 2. Admin Quick Link */}
            {isAdmin && (
              <Link 
                to="/admin" 
                className="hidden md:flex items-center gap-2 bg-red-50 text-red-600 border border-red-100 px-4 py-2 rounded-xl font-black text-[10px] hover:bg-red-600 hover:text-white transition-all tracking-widest uppercase"
              >
                <ShieldCheck size={16} /> Admin Panel
              </Link>
            )}

            {/* 3. Post Property (Universal for logged-in users) */}
            <Link 
              to="/post" 
              className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-2xl font-bold text-sm hover:bg-blue-600 transition-all shadow-xl shadow-gray-200"
            >
              <PlusCircle size={18} /> 
              <span className="hidden sm:inline">Post Property</span>
            </Link>

            {/* 4. User Profile Dropdown Style */}
            <div className="flex items-center gap-3 border-l pl-4 border-gray-100">
              <Link 
                to="/profile" 
                className="flex items-center gap-3 p-1 rounded-2xl hover:bg-gray-50 transition-all"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-inner ${isAdmin ? 'bg-red-500' : 'bg-blue-600'}`}>
                  {userInitial}
                </div>
                
                <div className="hidden lg:block">
                  <p className="text-[10px] uppercase font-black text-gray-400 leading-none mb-1 tracking-widest">
                    {isAdmin ? 'System Admin' : 'Property Owner'}
                  </p>
                  <p className="text-sm font-bold text-gray-800 leading-none flex items-center">
                    {user?.name?.split(' ')[0]} <ChevronRight size={14} className="text-gray-300 ml-1" />
                  </p>
                </div>
              </Link>

              <button 
                onClick={handleLogout} 
                className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
              >
                <LogOut size={20} />
              </button>
            </div>
          </>
        ) : (
          /* 5. Guest View */
          <div className="flex items-center gap-2">
            <Link to="/login" className="text-gray-600 font-bold text-sm px-5 py-2 hover:text-blue-600 transition">Log In</Link>
            <Link 
              to="/signup" 
              className="bg-blue-600 text-white px-6 py-2.5 rounded-2xl font-black text-sm shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all"
            >
              Start Selling
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;