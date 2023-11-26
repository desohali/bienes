import * as React from 'react';
import { Routes, Route } from "react-router-dom";
import Login from './components/Login';
import Registro from './components/Registro';


function App() {


  return (
    <Routes>
      {/* <Route path="/" element={<div />} > */}
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/admin" element={<div />} />
      {/* </Route> */}
    </Routes>
  )
}

export default App;
