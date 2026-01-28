// client/src/pages/Dashboard.jsx
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { Plus, Layout, LogOut, User, Search, Star, Filter } from "lucide-react"; // Added Star and Filter icons for innovation

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [boards, setBoards] = useState([]);
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); // New state for search functionality
  const [filteredBoards, setFilteredBoards] = useState([]); // Filtered boards based on search

  // A list of gradients to make boards look colorful
  const gradients = [
    "bg-gradient-to-br from-purple-600 to-blue-500",
    "bg-gradient-to-br from-pink-500 to-rose-500",
    "bg-gradient-to-br from-emerald-500 to-teal-400",
    "bg-gradient-to-br from-orange-400 to-red-500",
    "bg-gradient-to-br from-blue-400 to-indigo-600",
  ];

  // Helper to pick a gradient based on the board ID (so it stays consistent)
  const getGradient = (id) => {
    const charCode = id.charCodeAt(0) + id.charCodeAt(id.length - 1);
    return gradients[charCode % gradients.length];
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  // New effect to filter boards based on search query
  useEffect(() => {
    setFilteredBoards(
      boards.filter((board) =>
        board.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [boards, searchQuery]);

  const fetchBoards = async () => {
    try {
      const res = await axios.get(`${"https://taskflow-api-0bfc.onrender.com"}/api/boards`);
      setBoards(res.data);
    } catch (err) {
      toast.error("Failed to load boards");
    } finally {
      setLoading(false);
    }
  };

  const createBoard = async (e) => {
    e.preventDefault();
    if (!newBoardTitle) return;

    try {
      const res = await axios.post(`${"https://taskflow-api-0bfc.onrender.com"}/api/boards`, { title: newBoardTitle });
      setBoards([...boards, res.data]);
      setNewBoardTitle("");
      toast.success("Board created successfully!");
    } catch (err) {
      toast.error("Failed to create board");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      
      {/* 1. Navbar - Enhanced with subtle animation on hover */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2 group">
              <div className="bg-blue-600 p-1.5 rounded-lg group-hover:scale-110 transition-transform duration-200">
                <Layout className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 group-hover:from-purple-600 group-hover:to-blue-600 transition-all duration-300">
                TaskFlow
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full border border-gray-200 hover:bg-gray-200 transition-colors cursor-pointer">
                <User size={16} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-700">{user?.email?.split('@')[0]}</span>
              </div>
              <button 
                onClick={logout} 
                className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50 hover:rotate-12 transform duration-200"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section - Added subtle parallax-like effect and enhanced form */}
      <div className="bg-white border-b border-gray-200 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
          <h1 className="text-3xl font-bold text-gray-900 animate-fade-in">
            Welcome back! 👋
          </h1>
          <p className="mt-2 text-gray-500 animate-fade-in animation-delay-200">Manage your projects and track your productivity.</p>
          
          {/* Create Board Input - Enhanced with floating label and better animations */}
          <div className="mt-8 max-w-xl">
            <form onSubmit={createBoard} className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Plus className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 group-focus-within:scale-110 transition-all duration-200" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:shadow-lg transition-all duration-300 shadow-sm"
                placeholder="Create a new board (e.g., 'Marketing Launch')..."
                value={newBoardTitle}
                onChange={(e) => setNewBoardTitle(e.target.value)}
              />
              <button 
                type="submit" 
                className="absolute inset-y-1.5 right-1.5 px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md hover:shadow-xl hover:scale-105 transition-all duration-200"
              >
                Create
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* 3. Boards Grid - Added search, staggered animations, and interactive elements */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Layout size={20} className="text-gray-500" /> 
            Your Workspaces
          </h2>
          <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border shadow-sm">
            {filteredBoards.length} Active Project{filteredBoards.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* New Search Bar for Innovation */}
        <div className="mb-6 max-w-md">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
              placeholder="Search boards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-32 bg-gray-200 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* New Board Card - Enhanced with pulse animation and interactive hover */}
            <div 
              onClick={() => document.querySelector('input').focus()}
              className="group border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 hover:scale-105 transition-all duration-300 h-40 animate-bounce-in"
            >
              <div className="p-3 bg-gray-100 rounded-full group-hover:bg-blue-100 group-hover:animate-pulse transition-all">
                <Plus className="h-6 w-6 text-gray-400 group-hover:text-blue-600" />
              </div>
              <p className="mt-2 text-sm font-medium text-gray-500 group-hover:text-blue-600">Create new board</p>
            </div>

            {/* Actual Boards - Added staggered animations, tilt on hover, and favorite icon */}
            {filteredBoards.map((board, index) => (
              <Link 
                to={`/board/${board.id}`} 
                key={board.id} 
                className={`relative group bg-white rounded-xl shadow-sm hover:shadow-xl hover:-rotate-1 transition-all duration-300 overflow-hidden border border-gray-100 h-40 flex flex-col justify-between animate-slide-up`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Colorful Header Strip */}
                <div className={`h-2 w-full ${getGradient(board.id)}`} />
                
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors truncate flex-1">
                      {board.title}
                    </h3>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-yellow-100 rounded-full">
                      <Star className="h-4 w-4 text-gray-400 hover:text-yellow-500" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Updated {new Date(board.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="px-6 pb-4 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100 transition-colors">Open Board &rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && filteredBoards.length === 0 && searchQuery && (
          <div className="text-center py-20">
            <div className="bg-gray-100 p-4 rounded-full inline-block mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No boards match your search</h3>
            <p className="mt-1 text-gray-500">Try a different keyword or create a new board.</p>
          </div>
        )}

        {!loading && boards.length === 0 && !searchQuery && (
          <div className="text-center py-20">
            <div className="bg-gray-100 p-4 rounded-full inline-block mb-4 animate-bounce">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No boards found</h3>
            <p className="mt-1 text-gray-500">Get started by creating a new project board above.</p>
          </div>
        )}
      </main>

      {/* Custom CSS for animations (add to your global CSS or use Tailwind config) */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.5s ease-out;
        }
        @keyframes bounce-in {
          0% { opacity: 0; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
