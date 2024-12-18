import React from 'react';
import { Route, Routes } from 'react-router-dom';  
import Content from './Content';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Content />} />
      <Route path="/page/:pageNumber" element={<Content />} />
    </Routes>
  );
};

export default App;
