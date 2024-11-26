
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Events from "./components/Events"
import Volunteers from "./components/Volunteer/Volunteers";
import AssignVolunteers from "./components/Volunteer/AssignVolunteers";
import "./global.scss";
import "./App.css"
import Home from "./components/Home";
import Index from "./components/UploadRunnerData/Index";
import CreateVolunteers from "./components/Volunteer/CreateVolunteers";
import Login from "./components/Login";
import Statistics from "./components/UploadRunnerData/Statistics";
import UploadedData from "./components/UploadRunnerData/UploadedData";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
           <Route index element={<Home />} /> 
           <Route path="/login" element={<Login />} /> 
          <Route path="/events" element={<Events />} />
          <Route path="/volunteers" element={<Volunteers />} />
          <Route path="create-volunteer" element={<CreateVolunteers />} />
          <Route path="assign-volunteers" element={<AssignVolunteers/> }/>
          <Route path="/upload-runnerdata" element={<Index/> }/>
          <Route path="/statistics" element={<Statistics /> }/>
          <Route path="/list" element={<UploadedData /> }/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
