// client/src/pages/BoardView.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import TaskModal from "../components/TaskModal";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../CalendarStyles.css";
import { ArrowLeft, Plus, Calendar as CalIcon, Layout, Clock, AlertCircle, ChevronLeft, ChevronRight, Sparkles, Zap } from "lucide-react";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Custom Toolbar Component
const CustomToolbar = (toolbar) => {
  const goToBack = () => {
    toolbar.onNavigate('PREV');
  };

  const goToNext = () => {
    toolbar.onNavigate('NEXT');
  };

  const label = () => {
    const date = toolbar.date;
    return (
      <span className="flex items-baseline gap-3">
        <span className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">{format(date, 'yyyy')}</span>
        <span className="text-6xl font-['Dancing_Script'] bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500">{format(date, 'MMMM')}</span>
      </span>
    );
  };

  return (
    <div className="flex justify-between items-center mb-8 px-6 pt-4">
      <button onClick={goToBack} className="p-3 hover:bg-purple-500/20 rounded-full text-purple-400 hover:text-purple-300 transition-all hover:scale-110 shadow-lg">
        <ChevronLeft size={32} />
      </button>
      
      <div className="text-center">
        {label()}
      </div>

      <button onClick={goToNext} className="p-3 hover:bg-purple-500/20 rounded-full text-purple-400 hover:text-purple-300 transition-all hover:scale-110 shadow-lg">
        <ChevronRight size={32} />
      </button>
    </div>
  );
};

const BoardView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingTaskTo, setAddingTaskTo] = useState(null);
  const [newTaskContent, setNewTaskContent] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [view, setView] = useState("kanban");
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    fetchBoard();
  }, [id]);

  const fetchBoard = async () => {
    try {
      const res = await axios.get(`${"https://taskflow-api-0bfc.onrender.com"}/api/boards/${id}`);
      setBoard(res.data);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to load board");
      setLoading(false);
    }
  };

  const addTask = async (columnId) => {
    if (!newTaskContent) return;
    try {
      const res = await axios.post(`${"https://taskflow-api-0bfc.onrender.com"}/api/tasks`, {
        content: newTaskContent,
        columnId,
        boardId: id,
      });
      const newBoard = { ...board };
      const column = newBoard.columns.find((c) => c.id === columnId);
      column.tasks.push(res.data);
      setBoard(newBoard);
      setNewTaskContent("");
      setAddingTaskTo(null);
      toast.success("Task added!");
    } catch (err) {
      toast.error("Failed to add task");
    }
  };

  const onTaskUpdate = (updatedTask) => {
    const newBoard = { ...board };
    const column = newBoard.columns.find((c) => c.id === updatedTask.columnId);
    const taskIndex = column.tasks.findIndex((t) => t.id === updatedTask.id);
    if (taskIndex !== -1) {
      column.tasks[taskIndex] = updatedTask;
      setBoard(newBoard);
    }
  };

  const onTaskDelete = (taskId) => {
    const newBoard = { ...board };
    newBoard.columns.forEach((col) => {
      col.tasks = col.tasks.filter((t) => t.id !== taskId);
    });
    setBoard(newBoard);
  };

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const newBoard = { ...board };
    const sourceCol = newBoard.columns.find((col) => col.id === source.droppableId);
    const destCol = newBoard.columns.find((col) => col.id === destination.droppableId);
    const [movedTask] = sourceCol.tasks.splice(source.index, 1);
    
    movedTask.columnId = destCol.id;
    destCol.tasks.splice(destination.index, 0, movedTask);
    setBoard(newBoard);

    try {
      await axios.put(`${"https://taskflow-api-0bfc.onrender.com"}/api/tasks/${draggableId}/move`, {
        columnId: destCol.id,
        order: destination.index,
      });
      toast.success("Task moved!");
    } catch (err) {
      toast.error("Failed to move task");
    }
  };

  const getCalendarEvents = () => {
    const events = [];
    board.columns.forEach((col) => {
      col.tasks.forEach((task) => {
        if (task.dueDate) {
          const date = new Date(task.dueDate);
          events.push({
            title: task.content,
            start: date,
            end: date,
            resource: task,
            allDay: true
          });
        }
      });
    });
    return events;
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
        <div className="relative animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-cyan-400 border-r-purple-500 border-b-pink-500"></div>
      </div>
    </div>
  );
  
  if (!board) return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="text-center">
        <div className="text-2xl font-bold text-white mb-2">Board not found</div>
        <button onClick={() => navigate("/")} className="text-purple-400 hover:text-purple-300 underline">
          Return to Dashboard
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 font-sans text-white relative overflow-hidden">
      
      {/* Modern Overlapping Background Text Design */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large overlapping text elements */}
        <div className="absolute -top-32 -left-40 text-[25rem] font-black text-cyan-500/3 transform -rotate-12 select-none leading-none">
          BOARD
        </div>
        <div className="absolute top-1/4 right-0 text-[20rem] font-black text-purple-500/3 transform rotate-6 select-none leading-none">
          TASKS
        </div>
        <div className="absolute bottom-0 left-1/4 text-[18rem] font-black text-pink-500/3 transform -rotate-6 select-none leading-none">
          WORK
        </div>
        
        {/* Medium overlapping words */}
        <div className="absolute top-1/3 left-1/5 text-9xl font-black text-orange-400/5 transform rotate-45 select-none">
          PLAN
        </div>
        <div className="absolute bottom-1/4 right-1/5 text-8xl font-black text-green-400/5 transform -rotate-30 select-none">
          TRACK
        </div>
        <div className="absolute top-2/3 right-1/3 text-7xl font-black text-blue-400/5 transform rotate-15 select-none">
          ACHIEVE
        </div>
        
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse-slower"></div>
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl animate-pulse-slowest"></div>
      </div>
      
      {/* Glassmorphic Header */}
      <header className="relative bg-white/5 backdrop-blur-xl border-b border-white/10 px-6 py-5 flex justify-between items-center shadow-2xl z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/")} 
            className="group relative text-purple-400 hover:text-purple-300 hover:bg-purple-500/20 p-3 rounded-full transition-all hover:scale-110 shadow-lg"
            title="Back to Dashboard"
          >
            <ArrowLeft size={22} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
                {board.title}
              </h1>
              <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
            </div>
            <p className="text-xs text-white/60 font-medium mt-1 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              Active Workspace
            </p>
          </div>
        </div>
        
        {/* View Toggle */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-20"></div>
          <div className="relative flex bg-white/10 backdrop-blur-md rounded-xl p-1.5 border border-white/20 shadow-xl">
            <button 
              onClick={() => setView("kanban")}
              className={`flex items-center gap-2 px-6 py-2.5 text-sm font-bold rounded-lg transition-all ${
                view === "kanban" 
                  ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-purple-500/50" 
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <Layout size={16} /> Board
            </button>
            <button 
              onClick={() => setView("calendar")}
              className={`flex items-center gap-2 px-6 py-2.5 text-sm font-bold rounded-lg transition-all ${
                view === "calendar" 
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-pink-500/50" 
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <CalIcon size={16} /> Calendar
            </button>
          </div>
        </div>
      </header>

      {/* Main Canvas */}
      <div className="flex-1 overflow-hidden relative">
        {view === "kanban" ? (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="h-full overflow-x-auto p-8 relative z-10">
              <div className="flex gap-6 h-full items-start">
                {board.columns.map((column, colIndex) => {
                  // Define color schemes for each column
                  const columnStyles = {
                    'To Do': {
                      badge: 'bg-slate-500',
                      glow: 'from-slate-500/20 to-slate-600/20',
                      border: 'border-slate-500/30',
                      hover: 'hover:border-slate-400/50'
                    },
                    'In Progress': {
                      badge: 'bg-blue-500',
                      glow: 'from-blue-500/20 to-cyan-500/20',
                      border: 'border-blue-500/30',
                      hover: 'hover:border-blue-400/50'
                    },
                    'Done': {
                      badge: 'bg-green-500',
                      glow: 'from-green-500/20 to-emerald-500/20',
                      border: 'border-green-500/30',
                      hover: 'hover:border-green-400/50'
                    }
                  };
                  
                  const style = columnStyles[column.title] || columnStyles['To Do'];
                  
                  return (
                    <div 
                      key={column.id} 
                      className="min-w-[320px] w-[320px] flex flex-col max-h-full animate-slide-up"
                      style={{ animationDelay: `${colIndex * 100}ms` }}
                    >
                      {/* Column Header */}
                      <div className="flex items-center justify-between p-4 mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${style.badge} shadow-lg animate-pulse`} />
                          <h3 className="font-black text-white text-sm uppercase tracking-wider">
                            {column.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/80 text-xs font-bold px-3 py-1.5 rounded-full border border-white/20">
                          <Zap size={12} className="text-yellow-400" />
                          {column.tasks.length}
                        </div>
                      </div>

                      {/* Column Content */}
                      <div className={`relative bg-white/5 backdrop-blur-md rounded-2xl p-3 border ${style.border} ${style.hover} flex flex-col gap-3 max-h-full overflow-hidden shadow-2xl transition-all duration-300`}>
                        {/* Gradient glow effect */}
                        <div className={`absolute -inset-1 bg-gradient-to-br ${style.glow} rounded-2xl blur-xl opacity-0 hover:opacity-100 transition-opacity duration-300`}></div>
                        
                        <Droppable droppableId={column.id}>
                          {(provided, snapshot) => (
                            <div
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                              className={`relative flex-1 overflow-y-auto space-y-3 p-2 transition-all duration-300 min-h-[150px] rounded-xl ${
                                snapshot.isDraggingOver ? "bg-gradient-to-br from-purple-500/20 to-pink-500/20 ring-2 ring-purple-400/50" : ""
                              }`}
                            >
                              {column.tasks.map((task, index) => (
                                <Draggable key={task.id} draggableId={task.id} index={index}>
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      onClick={() => setSelectedTask(task)}
                                      className={`
                                        group relative bg-white/10 backdrop-blur-lg p-5 rounded-xl border border-white/20
                                        hover:bg-white/15 hover:border-purple-400/50 hover:shadow-2xl hover:shadow-purple-500/20
                                        cursor-pointer transition-all duration-300
                                        ${snapshot.isDragging ? "shadow-2xl shadow-cyan-500/50 ring-2 ring-cyan-400 rotate-3 scale-105 z-50 bg-white/20" : "shadow-lg"}
                                      `}
                                    >
                                      {/* Priority indicator */}
                                      {task.priority !== 'LOW' && (
                                        <div className={`absolute top-4 right-4 w-2.5 h-2.5 rounded-full shadow-lg ${
                                          task.priority === 'HIGH' ? 'bg-red-500 animate-pulse' : 'bg-yellow-400'
                                        }`} title={`Priority: ${task.priority}`} />
                                      )}

                                      {/* Task content */}
                                      <div className="text-white font-semibold text-sm leading-relaxed mb-3 pr-4">
                                        {task.content}
                                      </div>
                                      
                                      {/* Task metadata */}
                                      <div className="flex items-center gap-2 flex-wrap">
                                        {task.dueDate && (
                                          <div className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg backdrop-blur-sm ${
                                            new Date(task.dueDate) < new Date() 
                                              ? 'bg-red-500/30 text-red-300 border border-red-500/50' 
                                              : 'bg-white/10 text-white/80 border border-white/20'
                                          }`}>
                                            <Clock size={12} />
                                            {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                          </div>
                                        )}
                                        {task.priority === 'HIGH' && (
                                          <div className="flex items-center gap-1.5 text-xs font-bold bg-red-500/30 text-red-300 px-2.5 py-1 rounded-lg border border-red-500/50 backdrop-blur-sm">
                                            <AlertCircle size={12} /> High
                                          </div>
                                        )}
                                      </div>
                                      
                                      {/* Hover effect overlay */}
                                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/10 rounded-xl transition-all duration-300 pointer-events-none"></div>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>

                        {/* Add task button/form */}
                        {addingTaskTo === column.id ? (
                          <div className="relative p-3 bg-white/10 backdrop-blur-lg rounded-xl border border-purple-400/50 shadow-xl animate-in fade-in zoom-in-95 duration-200">
                            <textarea
                              autoFocus
                              placeholder="Type task title..."
                              className="w-full text-sm p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none backdrop-blur-sm"
                              rows="2"
                              value={newTaskContent}
                              onChange={(e) => setNewTaskContent(e.target.value)}
                              onKeyDown={(e) => {
                                if(e.key === 'Enter' && !e.shiftKey) {
                                  e.preventDefault();
                                  addTask(column.id);
                                }
                              }}
                            />
                            <div className="flex justify-end gap-2 mt-3">
                              <button 
                                onClick={() => setAddingTaskTo(null)} 
                                className="px-4 py-2 text-xs text-white/70 hover:text-white hover:bg-white/10 rounded-lg font-medium transition-all"
                              >
                                Cancel
                              </button>
                              <button 
                                onClick={() => addTask(column.id)} 
                                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-lg hover:shadow-lg hover:shadow-purple-500/50 font-bold transition-all hover:scale-105"
                              >
                                Add Task
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button 
                            onClick={() => setAddingTaskTo(column.id)} 
                            className="relative flex items-center justify-center gap-2 p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all text-sm font-bold border-2 border-dashed border-white/20 hover:border-purple-400/50 group"
                          >
                            <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" /> 
                            Add Card
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </DragDropContext>
        ) : (
          // Calendar View with modern styling
          <div className="p-10 h-full relative z-10">
            <div className="custom-calendar-modern h-full bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
              <Calendar
                localizer={localizer}
                events={getCalendarEvents()}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
                onSelectEvent={(event) => setSelectedTask(event.resource)}
                date={date}
                onNavigate={(newDate) => setDate(newDate)}
                views={['month']}
                components={{
                  toolbar: CustomToolbar
                }}
              />
            </div>
          </div>
        )}
      </div>

      {selectedTask && (
        <TaskModal 
          task={selectedTask} 
          onClose={() => setSelectedTask(null)} 
          onUpdate={onTaskUpdate}
          onDelete={onTaskDelete}
        />
      )}

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
          animation-fill-mode: both;
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

        /* Custom scrollbar styling */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: rgba(147, 51, 234, 0.5);
          border-radius: 10px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: rgba(147, 51, 234, 0.7);
        }

        /* Modern calendar styling */
        .custom-calendar-modern .rbc-calendar {
          color: white;
        }
        .custom-calendar-modern .rbc-header {
          padding: 1rem;
          font-weight: 700;
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: rgba(255, 255, 255, 0.9);
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.1) !important;
        }
        .custom-calendar-modern .rbc-date-cell {
          padding: 0.5rem;
          color: rgba(255, 255, 255, 0.7);
          font-weight: 600;
        }
        .custom-calendar-modern .rbc-today {
          background: rgba(147, 51, 234, 0.2);
        }
        .custom-calendar-modern .rbc-event {
          background: linear-gradient(135deg, rgb(139, 92, 246), rgb(219, 39, 119));
          border: none;
          border-radius: 0.5rem;
          padding: 0.25rem 0.5rem;
          font-weight: 600;
          font-size: 0.75rem;
        }
        .custom-calendar-modern .rbc-day-bg {
          background: rgba(255, 255, 255, 0.02);
          border-color: rgba(255, 255, 255, 0.1) !important;
        }
        .custom-calendar-modern .rbc-off-range-bg {
          background: rgba(0, 0, 0, 0.2);
        }
        .custom-calendar-modern .rbc-month-view {
          border-color: rgba(255, 255, 255, 0.1);
          border-radius: 1rem;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default BoardView;
