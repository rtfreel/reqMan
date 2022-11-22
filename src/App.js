import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import Analysis from './components/Analysis';
import Identification from './components/Identification';
import Planning from './components/Planning';
import RiskNavigation from './components/RiskNavigation';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import Experts from "./components/Experts";
import Clients from "./components/Clients";
import Charts from "./components/Charts";

function App() {
  return (
    <div className="App h-100">
      <Router>
        <RiskNavigation/>
        <div className="container">
          <Routes>
              <Route exact path="/" element={<Identification/>}/>
              <Route exact path="/identification" element={<Identification/>}/>
              <Route exact path="/analysis" element={<Analysis key="pre-analysis" persCookie="pers" lrersCookie="lrers"/>}/>
              <Route exact path="/planning" element={<Planning/>}/>
              <Route exact path="/monitoring" element={<Analysis key="post-analysis" persCookie="erpers" lrersCookie="elrers"/>}/>
              <Route exact path="/experts" element={<Experts/>}/>
              <Route exact path="/clients" element={<Clients/>}/>
              <Route exact path="/charts" element={<Charts/>}/>
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
