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

  // Expanded list of vibrant gradients for boards
  const gradients = [
    "bg-gradient-to-br from-purple-600 via-pink-500 to-red-500",
    "bg-gradient-to-br from-blue-500 via-cyan-400 to-green-400",
    "bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600",
    "bg-gradient-to-br from-green-500 via-teal-400 to-blue-500",
    "bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-500",
    "bg-gradient-to-br from-rose-500 via-orange-400 to-yellow-500",
    "bg-gradient-to-br from-emerald-500 via-lime-400 to-cyan-500",
    "bg-gradient-to-br from-violet-600 via-fuchsia-500 to-rose-500",
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-600 font-sans text-white relative overflow-hidden">
      {/* Vibrant Background Words/Elements with Overlapping for Modern Stylish Look */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 text-8xl font-black text-yellow-300 transform rotate-12 z-10">TaskFlow</div>
        <div className="absolute top-1/4 right-20 text-6xl font-black text-cyan-300 transform -rotate-6 z-20">Productivity</div>
        <div className="absolute bottom-20 left-1/4 text-5xl font-black text-rose-300 transform rotate-45 z-5">Manage</div>
        <div className="absolute bottom-1/3 right-10 text-9xl font-black text-lime-300 transform -rotate-12 z-15">Projects</div>
        <div className="absolute top-1/2 left-1/2 text-4xl font-black text-orange-300 transform rotate-90 z-25">Workflow</div>
        <div className="absolute top-3/4 left-1/5 text-7xl font-black text-violet-300 transform rotate-30 z-5">Create</div>
        <div className="absolute bottom-1/4 right-1/3 text-6xl font-black text-emerald-300 transform -rotate-45 z-10">Innovate</div>
        <div className="absolute top-1/6 right-1/4 text-5xl font-black text-red-300 transform rotate-60 z-20">Achieve</div>
      </div>
      
      {/* 1. Navbar - Colorful glassmorphism with vibrant accents */}
      <nav className="bg-white/20 backdrop-blur-lg border-b border-white/30 sticky top-0 z-30 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2 group">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-2 rounded-xl group-hover:scale-110 transition-transform duration-200 shadow-lg">
                <Layout className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-pink-500 to-cyan-400 group-hover:from-cyan-400 group-hover:to-yellow-400 transition-all duration-300">
                TaskFlow
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 hover:bg-white/30 transition-colors cursor-pointer shadow-lg">
                <User size={16} className="text-white" />
                <span className="text-sm font-semibold text-white">{user?.email?.split('@')[0]}</span>
              </div>
              <button 
                onClick={logout} 
                className="p-2 text-white hover:text-red-300 transition-colors rounded-full hover:bg-red-500/20 hover:rotate-12 transform duration-200 shadow-lg"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section - Vibrant gradients and overlapping text elements */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20 relative overflow-hidden shadow-inner">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/30 to-pink-500/30"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          <h1 className="text-5xl font-black text-white animate-fade-in bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-pink-400 to-cyan-300 drop-shadow-lg">
            Welcome back! 👋
          </h1>
          <p className="mt-4 text-xl text-white/90 animate-fade-in animation-delay-200 font-semibold drop-shadow-md">Manage your projects and track your productivity with vibrant style.</p>
          
          {/* Create Board Input - Colorful and sleek */}
          <div className="mt-12 max-w-xl">
            <form onSubmit={createBoard} className="relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Plus className="h-6 w-6 text-white/70 group-focus-within:text-yellow-300 group-focus-within:scale-110 transition-all duration-200" />
              </div>
              <input
                type="text"
                className="block w-full pl-14 pr-5 py-5 border border-white/30 rounded-3xl leading-5 bg-white/20 backdrop-blur-sm placeholder-white/70 focus:outline-none focus:bg-white/30 focus:ring-2 focus:ring-yellow-400 focus:border-transparent focus:shadow-2xl transition-all duration-300 shadow-xl text-white font-medium"
                placeholder="Create a new board (e.g., 'Marketing Launch')..."
                value={newBoardTitle}
                onChange={(e) => setNewBoardTitle(e.target.value)}
              />
              <button 
                type="submit" 
                className="absolute inset-y-2.5 right-2.5 px-8 py-2.5 bg-gradient-to-r from-pink-500 to-red-500 text-white text-sm font-bold rounded-2xl hover:from-red-500 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200"
              >
                Create
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* 3. Boards Grid - Colorful cards with modern overlapping vibes */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-black text-white flex items-center gap-3 drop-shadow-lg">
            <Layout size={28} className="text-yellow-300" /> 
            Your Workspaces
          </h2>
          <span className="text-sm text-white/80 bg-white/20 backdrop-blur-sm px-5 py-3 rounded-full border border-white/30 shadow-xl font-semibold">
            {filteredBoards.length} Active Project{filteredBoards.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Search Bar - Colorful and modern */}
        <div className="mb-10 max-w-md">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-white/70" />
            </div>
            <input
              type="text"
              className="block w-full pl-14 pr-5 py-4 border border-white/30 rounded-2xl leading-5 bg-white/20 backdrop-blur-sm placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent focus:shadow-xl transition-all duration-300 shadow-lg text-white font-medium"
              placeholder="Search boards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-48 bg-white/20 rounded-3xl animate-pulse shadow-2xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            
            {/* New Board Card - Vibrant and interactive */}
            <div 
              onClick={() => document.querySelector('input').focus()}
              className="group border-2 border-dashed border-white/40 rounded-3xl p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:border-yellow-400 hover:bg-yellow-400/20 hover:scale-105 transition-all duration-300 h-48 bg-white/10 backdrop-blur-sm shadow-2xl animate-bounce-in"
            >
              <div className="p-5 bg-white/20 rounded-full group-hover:bg-yellow-400/30 group-hover:animate-pulse transition-all shadow-xl">
                <Plus className="h-8 w-8 text-white/70 group-hover:text-yellow-300" />
              </div>
              <p className="mt-4 text-base font-bold text-white/80 group-hover:text-yellow-300">Create new board</p>
            </div>

            {/* Actual Boards - Colorful, stylish with overlapping feel */}
            {filteredBoards.map((board, index) => (
              <Link 
                to={`/board/${board.id}`} 
                key={board.id} 
                className={`relative group bg-white/20 backdrop-blur-lg rounded-3xl shadow-2xl hover:shadow-3xl hover:-rotate-2 transition-all duration-300 overflow-hidden border border-white/30 h-48 flex flex-col justify-between animate-slide-up`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Vibrant Header Strip */}
                <div className={`h-4 w-full ${getGradient(board.id)} shadow-inner`} />
                
                <div className="p-7">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-white group-hover:text-yellow-300 transition-colors truncate flex-1 drop-shadow-md">
                      {board.title}
                    </h3>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-yellow-400/20 rounded-full shadow-lg">
                      <Star className="h-5 w-5 text-white/70 hover:text-yellow-300" />
                    </button>
                  </div>
                  <p className="text-sm text-white/60 mt-3 font-medium drop-shadow-sm">
                    Updated {new Date(board.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="px-7 pb-6 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <span className="text-sm font-bold text-yellow-300 bg-white/20 px-4 py-2 rounded-xl hover:bg-white/30 transition-colors shadow-lg">Open Board &rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && filteredBoards.length === 0 && searchQuery && (
          <div className="text-center py-32">
            <div className="bg-white/20 p-8 rounded-full inline-block mb-8 shadow-2xl">
              <Search className="h-12 w-12 text-white/70" />
            </div>
            <h3 className="text-2xl font-bold text-white drop-shadow-lg">No boards match your search</h3>
            <p className="mt-3 text-white/80 font-medium drop-shadow-md">Try a different keyword or create a new board.</p>
          </div>
        )}

        {!loading && boards.length === 0 && !searchQuery && (
          <div className="text-center py-32">
            <div className="bg-white/20 p-8 rounded-full inline-block mb-8 animate-bounce shadow-2xl">
              <Search className="h-12 w-12 text-white/70" />
            </div>
            <h3 className="text-2xl font-bold text-white drop-shadow-lg">No boards found</h3>
            <p className="mt-3 text-white/80 font-medium drop-shadow-md">Get started by creating a new project board above.</p>
          </div>
        )}
      </main>

      {/* Custom CSS for animations */}
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
