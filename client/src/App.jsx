import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard"; // <--- Import the real file
import BoardView from "./pages/BoardView";
// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Dashboard /> {/* <--- Uses the imported component */}
            </ProtectedRoute>
          } 
        />
        <Route 
  path="/board/:id" 
  element={
    <ProtectedRoute>
      <BoardView />
    </ProtectedRoute>
  } 
/>
      </Routes>
    </>
  );
}

export default App;