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
import "../CalendarStyles.css"; // <--- IMPORT THE NEW STYLES
import { ArrowLeft, Plus, Calendar as CalIcon, Layout, Clock, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// --- CUSTOM TOOLBAR COMPONENT ---
// This creates the "August 2024" handwritten style
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
      <span className="flex items-baseline gap-2">
        <span className="text-3xl font-serif text-gray-500 font-bold">{format(date, 'yyyy')}</span>
        <span className="text-5xl font-['Dancing_Script'] text-gray-800">{format(date, 'MMMM')}</span>
      </span>
    );
  };

  return (
    <div className="flex justify-between items-center mb-6 px-4 pt-2">
      {/* Empty div to balance the center alignment if needed, or Back Button */}
      <button onClick={goToBack} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-800 transition">
        <ChevronLeft size={28} />
      </button>
      
      <div className="text-center">
        {label()}
      </div>

      <button onClick={goToNext} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-800 transition">
        <ChevronRight size={28} />
      </button>
    </div>
  );
};
// --------------------------------

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
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
  
  if (!board) return <div className="p-10 text-center text-gray-500">Board not found</div>;

  return (
    <div className="h-screen flex flex-col bg-gray-50 font-sans text-gray-900">
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/")} 
            className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-all"
            title="Back to Dashboard"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              {board.title}
            </h1>
            <p className="text-xs text-gray-400">Project Workspace</p>
          </div>
        </div>
        
        <div className="flex bg-gray-100 rounded-lg p-1 border border-gray-200">
          <button 
            onClick={() => setView("kanban")}
            className={`flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
              view === "kanban" ? "bg-white shadow text-blue-600" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <Layout size={16} /> Board
          </button>
          <button 
            onClick={() => setView("calendar")}
            className={`flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
              view === "calendar" ? "bg-white shadow text-blue-600" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <CalIcon size={16} /> Calendar
          </button>
        </div>
      </header>

      {/* Main Canvas */}
      <div className="flex-1 overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50/50">
        {view === "kanban" ? (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="h-full overflow-x-auto p-6">
              <div className="flex gap-6 h-full items-start">
                {board.columns.map((column) => (
                  <div key={column.id} className="min-w-[300px] w-[300px] flex flex-col max-h-full">
                    
                    <div className="flex items-center justify-between p-1 mb-2">
                      <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${
                          column.title === 'To Do' ? 'bg-gray-400' : 
                          column.title === 'In Progress' ? 'bg-blue-500' : 'bg-green-500'
                        }`} />
                        {column.title}
                      </h3>
                      <span className="bg-gray-200/50 text-gray-500 text-xs font-medium px-2 py-0.5 rounded-full">
                        {column.tasks.length}
                      </span>
                    </div>

                    <div className="bg-gray-100/50 rounded-xl p-2 border border-gray-200/50 flex flex-col gap-2 max-h-full overflow-hidden shadow-inner">
                      <Droppable droppableId={column.id}>
                        {(provided, snapshot) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className={`flex-1 overflow-y-auto space-y-3 p-1 transition-colors min-h-[100px] ${
                              snapshot.isDraggingOver ? "bg-blue-50/50 rounded-lg" : ""
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
                                      group relative bg-white p-4 rounded-lg border border-gray-100 
                                      hover:border-blue-300 hover:shadow-md cursor-pointer transition-all duration-200
                                      ${snapshot.isDragging ? "shadow-xl ring-2 ring-blue-500 rotate-2 z-50" : "shadow-sm"}
                                    `}
                                  >
                                    {task.priority !== 'LOW' && (
                                      <div className={`absolute top-3 right-3 w-2 h-2 rounded-full ${
                                        task.priority === 'HIGH' ? 'bg-red-500' : 'bg-yellow-400'
                                      }`} title={`Priority: ${task.priority}`} />
                                    )}

                                    <div className="text-gray-800 font-medium text-sm leading-snug mb-2">
                                      {task.content}
                                    </div>
                                    
                                    <div className="flex items-center gap-3 mt-3">
                                      {task.dueDate && (
                                        <div className={`flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded ${
                                          new Date(task.dueDate) < new Date() ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-500'
                                        }`}>
                                          <Clock size={12} />
                                          {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </div>
                                      )}
                                      {task.priority === 'HIGH' && (
                                        <div className="flex items-center gap-1 text-[10px] font-medium bg-red-50 text-red-600 px-1.5 py-0.5 rounded">
                                          <AlertCircle size={12} /> High
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>

                      {addingTaskTo === column.id ? (
                        <div className="p-2 bg-white rounded-lg shadow-sm border border-blue-200 animate-in fade-in zoom-in-95 duration-200">
                          <textarea
                            autoFocus
                            placeholder="Type a title..."
                            className="w-full text-sm p-2 border-0 focus:ring-0 resize-none placeholder-gray-400"
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
                          <div className="flex justify-end gap-2 mt-2">
                            <button onClick={() => setAddingTaskTo(null)} className="px-3 py-1 text-xs text-gray-500 hover:text-gray-700">Cancel</button>
                            <button onClick={() => addTask(column.id)} className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 font-medium">Add</button>
                          </div>
                        </div>
                      ) : (
                        <button 
                          onClick={() => setAddingTaskTo(column.id)} 
                          className="flex items-center gap-2 p-2 text-gray-500 hover:text-gray-800 hover:bg-white rounded-lg transition-all text-sm font-medium"
                        >
                          <Plus size={16} /> Add Card
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </DragDropContext>
        ) : (
          // --- CALENDAR VIEW ---
          <div className="p-8 h-full bg-gray-50">
            {/* The wrapper div gets the 'custom-calendar' class from our CSS */}
            <div className="custom-calendar h-full">
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
                // Inject our custom toolbar here
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
    </div>
  );
};

export default BoardView;