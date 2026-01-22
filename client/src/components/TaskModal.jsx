import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const TaskModal = ({ task, onClose, onUpdate, onDelete }) => {
  const [content, setContent] = useState(task.content);
  const [description, setDescription] = useState(task.description || "");
  const [priority, setPriority] = useState(task.priority);
  // Initialize date safely
  const [dueDate, setDueDate] = useState(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : "");

  const handleSave = async () => {
    try {
      const res = await axios.put(`${"https://taskflow-api-0bfc.onrender.com"}/api/tasks/${task.id}`, {
        content,
        description,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
      });
      onUpdate(res.data);
      onClose();
      toast.success("Task updated");
    } catch (err) {
      toast.error("Failed to update task");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      await axios.delete(`${"https://taskflow-api-0bfc.onrender.com"}/api/tasks/${task.id}`);
      onDelete(task.id);
      onClose();
      toast.success("Task deleted");
    } catch (err) {
      toast.error("Failed to delete task");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">✕</button>

        <h2 className="text-xl font-bold mb-4">Edit Task</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            className="w-full mt-1 p-2 border rounded focus:ring-blue-500 outline-none"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            className="w-full mt-1 p-2 border rounded focus:ring-blue-500 outline-none h-24"
            placeholder="Add details..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Priority</label>
            <select
              className="w-full mt-1 p-2 border rounded focus:ring-blue-500 outline-none"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Due Date</label>
            <input
              type="date"
              className="w-full mt-1 p-2 border rounded focus:ring-blue-500 outline-none"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button onClick={handleDelete} className="text-red-500 text-sm hover:underline">Delete Task</button>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
            <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;