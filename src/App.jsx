import React, { useState } from 'react';
import './App.css';
import Board from './main/board';
import MainChart from './explore/chart';

const MODES = {
  explore: 'explore',
  play: 'play',
};
function App() {
  const [mode, setMode] = useState(MODES.play);
  return (
    <>
      <button
        onClick={() =>
          setMode(mode === MODES.explore ? MODES.play : MODES.explore)
        }
      >
        {mode}
      </button>
      {mode === MODES.play ? <Board /> : <MainChart />}
    </>
  );
}

export default App;
