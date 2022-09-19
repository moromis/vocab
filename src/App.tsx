import "./App.css";
import { Header } from "./components/Header/Header";
import { Words } from "./features/words/Words";

function App() {
  return (
    <div className="App">
      <Header />
      <Words />
    </div>
  );
}

export default App;
