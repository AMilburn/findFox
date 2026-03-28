import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PlayerProvider } from "./context/PlayerProvider";
import { WelcomeScreen } from "./screens/Welcome/WelcomeScreen";
import { GameScreen } from "./screens/Game/GameScreen";
import { ScoreboardScreen } from "./screens/Scoreboard/ScoreboardScreen";
import "./App.css";

function App() {
  return (
    <PlayerProvider>
      <Router>
        <Routes>
          <Route path="/" element={<WelcomeScreen />} />
          <Route path="/game" element={<GameScreen />} />
          <Route path="/scoreboard" element={<ScoreboardScreen />} />
        </Routes>
      </Router>
    </PlayerProvider>
  );
}

export default App;
