// client/src/pages/Dashboard.jsx
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { Plus, Layout, LogOut, User, Search, Star, Sparkles, Trash2 } from "lucide-react";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [boards, setBoards] = useState([]);
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBoards, setFilteredBoards] = useState([]);

  // Enhanced vibrant gradients for boards
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

  const getGradient = (id) => {
    const charCode = id.charCodeAt(0) + id.charCodeAt(id.length - 1);
    return gradients[charCode % gradients.length];
  };

  useEffect(() => {
    fetchBoards();
  }, []);

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

  const deleteBoard = async (boardId, boardTitle, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!confirm(`Are you sure you want to delete "${boardTitle}"? This action cannot be undone.`)) return;

    try {
      await axios.delete(`${"https://taskflow-api-0bfc.onrender.com"}/api/boards/${boardId}`);
      setBoards(boards.filter(board => board.id !== boardId));
      toast.success("Board deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete board");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 font-sans text-white relative overflow-hidden">
      {/* Modern Overlapping Background Text Design */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Layer 1 - Large overlapping text */}
        <div className="absolute -top-20 -left-32 text-[20rem] font-black text-cyan-500/5 transform -rotate-12 select-none leading-none">
          TASK
        </div>
        <div className="absolute top-40 right-0 text-[18rem] font-black text-pink-500/5 transform rotate-6 select-none leading-none">
          FLOW
        </div>
        <div className="absolute top-1/3 -left-20 text-[15rem] font-black text-purple-500/5 transform -rotate-6 select-none leading-none">
          PRO
        </div>
        <div className="absolute bottom-20 right-10 text-[16rem] font-black text-orange-500/5 transform rotate-12 select-none leading-none">
          JECT
        </div>
        
        {/* Layer 2 - Medium overlapping words */}
        <div className="absolute top-1/4 left-1/4 text-8xl font-black text-yellow-400/8 transform rotate-45 select-none">
          CREATE
        </div>
        <div className="absolute bottom-1/3 right-1/4 text-7xl font-black text-green-400/8 transform -rotate-12 select-none">
          MANAGE
        </div>
        <div className="absolute top-2/3 left-1/3 text-9xl font-black text-blue-400/8 transform rotate-90 select-none">
          BUILD
        </div>
        
        {/* Layer 3 - Scattered smaller words */}
        <div className="absolute top-1/2 right-1/3 text-5xl font-black text-red-400/10 transform -rotate-45 select-none">
          ORGANIZE
        </div>
        <div className="absolute bottom-1/4 left-1/5 text-6xl font-black text-violet-400/10 transform rotate-30 select-none">
          INNOVATE
        </div>
        <div className="absolute top-1/6 right-1/5 text-5xl font-black text-teal-400/10 transform -rotate-20 select-none">
          ACHIEVE
        </div>
        
        {/* Animated gradient orbs for depth */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-slower"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse-slowest"></div>
      </div>
      
      {/* Glassmorphic Navbar */}
      <nav className="bg-white/5 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300 opacity-70"></div>
                <div className="relative bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 p-3 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                  <Layout className="w-7 h-7 text-white" />
                </div>
              </div>
              <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 group-hover:from-pink-400 group-hover:via-purple-400 group-hover:to-cyan-400 transition-all duration-500">
                TaskFlow
              </span>
              <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 px-5 py-2.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/15 hover:border-purple-400/50 transition-all duration-300 cursor-pointer shadow-lg group">
                <div className="p-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                  <User size={14} className="text-white" />
                </div>
                <span className="text-sm font-bold text-white/90 group-hover:text-white transition-colors">
                  {user?.email?.split('@')[0]}
                </span>
              </div>
              <button 
                onClick={logout} 
                className="group relative p-3 text-white hover:text-red-400 transition-all duration-300 rounded-full hover:bg-red-500/20 shadow-lg hover:shadow-red-500/50 hover:scale-110"
                title="Logout"
              >
                <LogOut size={22} className="group-hover:rotate-12 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Modern Design */}
      <div className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-500/20 to-cyan-500/20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="mb-2 inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 backdrop-blur-sm rounded-full border border-purple-400/30">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-purple-200">Workspace Active</span>
          </div>
          
          <h1 className="text-7xl font-black text-white mt-6 animate-fade-in leading-tight">
            Welcome back,
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mt-2">
              Creator! 👋
            </span>
          </h1>
          <p className="mt-6 text-xl text-white/70 animate-fade-in animation-delay-200 font-medium max-w-2xl">
            Manage your projects with style. Track progress, collaborate seamlessly, and achieve your goals.
          </p>
          
          {/* Modern Create Board Input */}
          <div className="mt-12 max-w-2xl">
            <form onSubmit={createBoard} className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
              <div className="relative flex items-center bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
                <div className="pl-6 pr-4 flex items-center pointer-events-none">
                  <Plus className="h-6 w-6 text-purple-400" />
                </div>
                <input
                  type="text"
                  className="flex-1 py-5 bg-transparent placeholder-white/50 focus:outline-none text-white font-medium text-lg"
                  placeholder="Create a new board (e.g., 'Marketing Launch')..."
                  value={newBoardTitle}
                  onChange={(e) => setNewBoardTitle(e.target.value)}
                />
                <button 
                  type="submit" 
                  className="m-2 px-8 py-3 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white text-sm font-bold rounded-2xl hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300 whitespace-nowrap"
                >
                  Create Board
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Boards Grid Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="flex items-center justify-between mb-12 flex-wrap gap-4">
          <div>
            <h2 className="text-4xl font-black text-white flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                <Layout size={28} className="text-white" />
              </div>
              Your Workspaces
            </h2>
            <p className="text-white/60 mt-2 ml-14 font-medium">Organize and manage all your projects</p>
          </div>
          <div className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-white/90 font-bold">
              {filteredBoards.length} Active Project{filteredBoards.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Modern Search Bar */}
        <div className="mb-12 max-w-md">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
            <div className="relative flex items-center bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl overflow-hidden">
              <div className="pl-5 pr-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-purple-400" />
              </div>
              <input
                type="text"
                className="flex-1 py-4 pr-5 bg-transparent placeholder-white/50 focus:outline-none text-white font-medium"
                placeholder="Search boards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-56 bg-white/5 rounded-3xl animate-pulse border border-white/10 shadow-xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Create New Board Card */}
            <div 
              onClick={() => document.querySelector('input').focus()}
              className="group relative border-2 border-dashed border-white/20 rounded-3xl p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:border-purple-400/50 hover:bg-white/5 transition-all duration-300 h-56 backdrop-blur-sm shadow-xl animate-bounce-in overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="p-6 bg-white/10 rounded-full group-hover:bg-gradient-to-r group-hover:from-purple-500/30 group-hover:to-cyan-500/30 transition-all duration-300 shadow-xl mb-4">
                  <Plus className="h-10 w-10 text-white/70 group-hover:text-white group-hover:rotate-90 transition-all duration-300" />
                </div>
                <p className="text-lg font-bold text-white/80 group-hover:text-white transition-colors">Create New Board</p>
                <p className="text-sm text-white/50 mt-2">Start a new project</p>
              </div>
            </div>

            {/* Actual Board Cards */}
            {filteredBoards.map((board, index) => (
              <Link 
                to={`/board/${board.id}`} 
                key={board.id} 
                className="group relative bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl hover:shadow-purple-500/20 hover:scale-105 transition-all duration-300 overflow-hidden border border-white/10 hover:border-purple-400/50 h-56 flex flex-col animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Gradient Header */}
                <div className={`h-2 w-full ${getGradient(board.id)}`} />
                
                {/* Hover Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative flex-1 p-7 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-400 transition-all duration-300 truncate flex-1 pr-2">
                        {board.title}
                      </h3>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <button 
                          onClick={(e) => deleteBoard(board.id, board.title, e)}
                          className="p-2 hover:bg-red-500/30 rounded-full transition-all hover:scale-110 z-10"
                          title="Delete board"
                        >
                          <Trash2 className="h-5 w-5 text-red-400 hover:text-red-300" />
                        </button>
                        <button className="p-2 hover:bg-yellow-400/20 rounded-full transition-all hover:scale-110">
                          <Star className="h-5 w-5 text-yellow-400 hover:fill-yellow-400" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-white/50 font-medium">
                      Updated {new Date(board.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex justify-between items-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <span className="text-sm font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
                      Open Board 
                      <span className="text-lg">→</span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty States */}
        {!loading && filteredBoards.length === 0 && searchQuery && (
          <div className="text-center py-32">
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-purple-500/20 blur-2xl"></div>
              <div className="relative bg-white/10 p-10 rounded-full backdrop-blur-sm shadow-2xl">
                <Search className="h-16 w-16 text-purple-400" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-white mb-3">No boards match your search</h3>
            <p className="text-white/60 font-medium text-lg">Try a different keyword or create a new board.</p>
          </div>
        )}

        {!loading && boards.length === 0 && !searchQuery && (
          <div className="text-center py-32">
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-cyan-500/20 blur-2xl animate-pulse"></div>
              <div className="relative bg-white/10 p-10 rounded-full backdrop-blur-sm shadow-2xl">
                <Layout className="h-16 w-16 text-cyan-400" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-white mb-3">No boards yet</h3>
            <p className="text-white/60 font-medium text-lg">Get started by creating your first project board above.</p>
          </div>
        )}
      </main>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
          animation-fill-mode: forwards;
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
          animation-fill-mode: both;
        }
        @keyframes bounce-in {
          0% { opacity: 0; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.02); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-bounce-in {
          animation: bounce-in 0.7s ease-out;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.05; transform: scale(1); }
          50% { opacity: 0.15; transform: scale(1.1); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        @keyframes pulse-slower {
          0%, 100% { opacity: 0.05; transform: scale(1); }
          50% { opacity: 0.15; transform: scale(1.1); }
        }
        .animate-pulse-slower {
          animation: pulse-slower 6s ease-in-out infinite;
        }
        @keyframes pulse-slowest {
          0%, 100% { opacity: 0.05; transform: scale(1); }
          50% { opacity: 0.15; transform: scale(1.1); }
        }
        .animate-pulse-slowest {
          animation: pulse-slowest 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
