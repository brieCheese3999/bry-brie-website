import React, { lazy, Suspense } from 'react';
import './App.css';
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";

// Route-level code splitting: the enter (/) screen and the main portfolio load
// as separate chunks, so the landing page doesn't ship the entire react95 UI,
// gallery, and contact-form code up front.
const EnterPage = lazy(() => import("./components/Home/EnterPage.tsx"));
const HomePage = lazy(() => import("./components/Home/HomePage.tsx"));

const App: React.FC = () => {
  return (
      <div className="App">
          <Router>
            <Suspense fallback={
              <main className="route-loading-page">
                <section className="route-loading-window" aria-label="Loading portfolio">
                  <div className="route-loading-titlebar">BRYANNA PLAISIR</div>
                  <div className="route-loading-content" role="status" aria-live="polite">
                    <p>Loading portfolio…</p>
                    <p>Please wait while the page opens.</p>
                  </div>
                </section>
              </main>
            }>
              <Routes>
                  <Route path="/" element={<EnterPage />} />
                  <Route path="/about" element={<HomePage />} />
                  <Route path="/photos" element={<HomePage />} />
                  <Route path="/ceramics" element={<HomePage />} />
                  <Route path="/contact" element={<HomePage />} />
                  <Route path="*" element={
                    <main className="not-found-page">
                      <section className="not-found-window" aria-labelledby="not-found-title">
                        <div className="not-found-titlebar">BRYANNA PLAISIR</div>
                        <div className="not-found-content">
                          <h1 id="not-found-title">Page not found</h1>
                          <p>This page doesn’t exist. You can return to my portfolio to explore my work.</p>
                          <Link to="/about">Back to portfolio</Link>
                        </div>
                      </section>
                    </main>
                  } />
              </Routes>
            </Suspense>
          </Router>
      </div>
  );
};

export default App;
