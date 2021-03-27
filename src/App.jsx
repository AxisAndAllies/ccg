import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { DragDropContext } from 'react-beautiful-dnd';
import Board from './game/board'

function App() {
  return <Board/>
}

export default App;
