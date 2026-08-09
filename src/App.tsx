import React, { lazy, Suspense } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Route-level code splitting: the enter (/) screen and the main portfolio load
// as separate chunks, so the landing page doesn't ship the entire react95 UI,
// gallery, and contact-form code up front.
const EnterPage = lazy(() => import("./components/Home/EnterPage.tsx"));
const HomePage = lazy(() => import("./components/Home/HomePage.tsx"));

const App: React.FC = () => {
  return (
      <div className="App">
          <Router>
            <Suspense fallback={null}>
              <Routes>
                  <Route path="/" element={<EnterPage />} />
                  <Route path="/about" element={<HomePage />} />
                  <Route path="/photos" element={<HomePage />} />
                  <Route path="/ceramics" element={<HomePage />} />
                  <Route path="/contact" element={<HomePage />} />
              </Routes>
            </Suspense>
          </Router>
      </div>
  );
};

export default App;
