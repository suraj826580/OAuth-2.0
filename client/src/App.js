import "./App.css";
import axios from "axios";
import { useEffect } from "react";
// import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
axios.defaults.withCredentials = true;
const Login = () => {
  const handleLogin = async () => {
    try {
      const {
        data: { url },
      } = await axios(process.env.REACT_APP_AUTH_URL);
      window.location.assign(url);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background:
          "linear-gradient(90deg, rgba(62,101,207,1) 38%, rgba(199,22,16,1) 100%)",
      }}>
      <button
        onClick={handleLogin}
        style={{
          padding: "10px",
          borderRadius: "5px",
          fontFamily: "verndana",
          fontSize: "20px",
        }}>
        Login With Google
      </button>
    </div>
  );
};
const Dashboard = () => {
  useEffect(() => {
    (async () => {
      try {
        const result = await axios(
          `http://localhost:8080/auth/token${window.location.search}`
        );
        console.log(result);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        minHeight: "100vh",
      }}>
      <h1>Dashboard</h1>
    </div>
  );
};
function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="auth/callback" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
