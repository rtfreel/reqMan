import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import HomePage from "./components/HomePage";
import Fractals from "./components/fractals/Fractals";
import PythagorasFractal from "./components/fractals/PythagorasFractal";
import MinkowskiFractal from "./components/fractals/MinkowskiFractal";
import ColorSchemes from "./components/ColorSchemes";
import Transformations from "./components/Transformations";
import Tutorial from "./components/Tutorial";
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";

function App() {
  return (
    <div className="App h-100">
    <Router basename="/cglab">
      <Routes>
        <Route exact path="/" element={<HomePage/>}/>
        <Route exact path="/fractals" element={<Fractals/>}/>
        <Route exact path="/fractals/pythagoras_tree" element={<PythagorasFractal/>}/>
        <Route exact path="/fractals/minkowski_island" element={<MinkowskiFractal/>}/>
        <Route exact path="/colors" element={<ColorSchemes/>}/>
        <Route exact path="/transformations" element={<Transformations/>}/>
        <Route exact path="/tutorial" element={<Tutorial/>}/>
      </Routes>
    </Router>
    </div>
  );
}

export default App;
