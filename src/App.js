import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import Analysis from './components/Analysis';
import Identification from './components/Identification';
import Monitoring from './components/Monitoring';
import Planning from './components/Planning';
import RiskNavigation from './components/RiskNavigation';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";

function App() {
  return (
    <div className="App h-100">
      <Router>
        <RiskNavigation/>
        <div className="container">
          <Routes>
              <Route exact path="/" element={<Identification/>}/>
              <Route exact path="/identification" element={<Identification/>}/>
              <Route exact path="/analysis" element={<Analysis/>}/>
              <Route exact path="/planning" element={<Planning/>}/>
              <Route exact path="/monitoring" element={<Monitoring/>}/>
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
