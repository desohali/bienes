import * as React from 'react';
import Login from './components/Login';
import Layout from './components/Layout';
import Registro from './components/Registro';
import Reportes from './components/Reportes';
import Usuarios from './components/Usuarios';
import { Routes, Route } from "react-router-dom";

function App() {

  return (
    <Routes>
      <Route path="/" element={<Layout><Login /></Layout>} />
      <Route path="/registro" element={<Layout><Registro /></Layout>} />
      <Route path="/admin/:password" element={<Layout><Reportes /></Layout>} />
      <Route path="/usuarios/:password" element={<Layout><Usuarios /></Layout>} />
    </Routes>
  )
}

export default App;
