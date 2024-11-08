
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import "./global.scss";
import "./App.css"
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Home />} />
         
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
