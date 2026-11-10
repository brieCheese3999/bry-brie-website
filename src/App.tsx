import React, { lazy, Suspense } from 'react';
import './App.css';
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";

const EnterPage = lazy(() => import('./components/Home/EnterPage.tsx'));
const HomePage = lazy(() => import('./components/Home/HomePage.tsx'));

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
                  <Route path="/ceramics/:pieceId" element={<HomePage />} />
                  <Route path="/resume" element={<HomePage />} />
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
