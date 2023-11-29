import * as React from 'react';
import { Routes, Route } from "react-router-dom";
import Login from './components/Login';
import Registro from './components/Registro';
import Reportes from './components/Reportes';


function App() {


  return (
    <Routes>
      {/* <Route path="/" element={<div />} > */}
      <Route path="/" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/admin" element={<Reportes />} />
      {/* </Route> */}
    </Routes>
  )
}

export default App;
