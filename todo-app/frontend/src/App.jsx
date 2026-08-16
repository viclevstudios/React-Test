import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Todos from "./TodoPage.jsx";
import Register from "./RegisterDialog/RegisterDialog.jsx";
import Login from "./LoginDialog/LoginDialog.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import NotFound from "./NotFound.jsx";
import { useTranslation } from "react-i18next";

//App
function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    function loadLanguage() {
      const savedLanguage = localStorage.getItem("language");

      i18n.init({
        lng: savedLanguage || "en"
      });
    }

    loadLanguage();
  }, []);


  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/todos" element={
        <ProtectedRoute>
          <Todos />
        </ProtectedRoute>
      } />

      <Route path="*" element={<NotFound />}></Route>

    </Routes>

  );
}

export default App