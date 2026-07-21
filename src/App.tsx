import React from 'react';
import './App.css';
import HomePage from "./components/HomePage";
import { createGlobalStyle } from 'styled-components';
import {BrowserRouter as Router,Route, Routes} from "react-router-dom";
import EnterPage from "./components/EnterPage.tsx";
import AboutPage from "./components/AboutMe.tsx";

// Define global styles, including font face
const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'CustomFont';
    src: url('assets/font/Baby_Gemoy.ttf') format('opentype'); /* Adjust the format as needed */
    font-weight: normal;
    font-style: normal;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: 'CustomFont', sans-serif;
  }
`;

const App: React.FC = () => {
  return (
      <div className="App">
        <GlobalStyle/>
          <Router>
            <Routes>
                <Route path="/" element={<EnterPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
            </Routes>
          </Router>
      </div>
  );
};

export default App;