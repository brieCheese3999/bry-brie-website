import React from 'react';
import './App.css';
import HomePage from "./components/Home/HomePage.tsx";
import {BrowserRouter as Router,Route, Routes} from "react-router-dom";
import EnterPage from "./components/Home/EnterPage.tsx";


const App: React.FC = () => {
  return (
      <div className="App">
          <Router>
            <Routes>
                <Route path="/" element={<EnterPage />} />
                <Route path="/about" element={<HomePage />} />
                <Route path="/photos" element={<HomePage />} />
                <Route path="/ceramics" element={<HomePage />} />
                <Route path="/contact" element={<HomePage />} />
            </Routes>
          </Router>
      </div>
  );
};

export default App;