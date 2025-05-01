import ReactDOM from "react-dom/client";
import "./App.css";
import React, { useState } from "react";
import App from "./App.jsx";
import Load from "./components/Loading/Load.jsx";

export default function MainApp() {
  const [isLoading, setIsLoading] = useState(true);

  const handleStartLearning = () => {
    setIsLoading(false);
  };

  return (
    <>
      {isLoading ? (
        <Load onStartLearning={handleStartLearning} />
      ) : (
        <App />
      )}
    </>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MainApp />
  </React.StrictMode>
);