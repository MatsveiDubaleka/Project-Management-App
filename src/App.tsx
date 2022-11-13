import { Boards } from 'pages/Boards';
import { NotFound } from 'pages/NotFound';
import { Register } from 'pages/Register';
import { Welcome } from 'pages/Welcome';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/register" element={<Register />} />
        <Route path="/boards" element={<Boards />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
