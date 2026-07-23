import React from 'react';
import './App.css';
import HomePage from "./components/Home/HomePage.tsx";
import { createGlobalStyle } from 'styled-components';
import {BrowserRouter as Router,Route, Routes} from "react-router-dom";

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
                <Route path="/" element={<HomePage />} />
            </Routes>
          </Router>
      </div>
  );
};

export default App;