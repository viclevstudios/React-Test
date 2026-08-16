import { Routes, Route } from "react-router-dom";

import Todos from "./TodoPage.jsx";
import Register from "./RegisterDialog/RegisterDialog.jsx";
import Login from "./LoginDialog/LoginDialog.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

//App
function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/todos" element={
        <ProtectedRoute>
          <Todos />
        </ProtectedRoute>
      }/></Routes>
  );
}

export default App