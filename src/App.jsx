
import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";


function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet", { name }));
  }

  const [url, setUrl] = useState('https://github.com/greeenboi/mobile_Chatapp'); // Default URL
  const [message, setMessage] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`http://localhost:8080/clone?url=${url}`);
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      console.error(error);
      setMessage('Error: Cloning failed');
    }
  };

  return (
    <div className="container">

      <button type="button" onClick={() => setIsDialogOpen(true)}>
        Clone Repository
      </button>

      <dialog open={isDialogOpen}>
        <form onSubmit={handleSubmit} className="col">
          <label htmlFor="url">Git Repository URL:</label>
          <input
            type="text"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button type="submit">Clone</button>
          <button type="button" onClick={() => setIsDialogOpen(false)}>
            Close
          </button>
        </form>
      </dialog>
      <p>{message}</p>
      <p>{greetMsg}</p>
    </div>
  );
}

export default App;
