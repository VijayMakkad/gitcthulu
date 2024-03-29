
import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import gitcthulu from "./assets/gitcthulu.png";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import LookupForm from "./Lookup";
import CommitHistory from "./CommitHistory";


function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");
  const [commits, setCommits] = useState(null);
  const [error, setError] = useState(null);
  
  const [url, setUrl] = useState('https://github.com/greeenboi/mobile_Chatapp'); // Default URL
  const [path, setPath] = useState('https://github.com/greeenboi/mobile_Chatapp'); // Default URL
  const [message, setMessage] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  

  const fetchCommitHistory = async (url) => {
    try {
      const response = await fetch(`http://localhost:8080/commits?url=${url}`);
      const data = await response.json();
      setCommits(data.commits || []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Error fetching commit history');
    } finally {
      // Optional: Clear loading state even in case of errors
      setCommits(null);
    }
  };

  useEffect(() => {
    // Handle initial state or potential future URL changes (optional)
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`http://localhost:8080/clone?url=${url}&path=${path}`);
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      console.error(error);
      setMessage('Error: Cloning failed');
    }
  };

  return (
    <div className="container">
      <header className="navbar">
        <img src={gitcthulu} alt="gitchthulu" style={{width:'4rem'}} />
        <h2>GitCthulu</h2>
      </header>
      <div className="git-clone">
        <h1>Operations</h1>
        <button type="button" onClick={() => setIsDialogOpen(true)}>
          Clone Repository
        </button>

        <div className={`${isDialogOpen ? 'dialog-background' : ''}`} onClick={() => setIsDialogOpen(false)}></div>
        <dialog open={isDialogOpen} className={`${isDialogOpen? 'dialog' : 'hidden'}`}>
          <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column'}}>
            <label htmlFor="url">Git Repository URL:</label>
            <input
              type="text"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <label htmlFor="url">Local Path to Clone to:</label>
            <input
              type="text"
              id="path"
              placeholder="Local Path"
              onChange={(e) => setPath(e.target.value)}
            />
            <button type="submit">Clone</button>
            <p>{message}</p>
            <button type="button" onClick={() => setIsDialogOpen(false)}>
              Close
            </button>
          </form>
        </dialog>
        <p>{greetMsg}</p>
      </div>
    </div>
  );
}

export default App;
