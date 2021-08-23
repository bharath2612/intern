import "./styles/App.css";
import User from "./pages/User";
import ThemeConfig from "./theme";

function App() {
  return (
    <ThemeConfig>
      <div className="App">
        <User />
        {/* <Table /> */}
      </div>
    </ThemeConfig>
  );
}

export default App;
