
import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import LookupForm from "./Lookup";
import CommitHistory from "./CommitHistory";


function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");
  const [commits, setCommits] = useState(null);
  const [error, setError] = useState(null);

  

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
      <div className="git-clone">

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

      <div className="commit-history">
        <h1>Git Commit History Lookup</h1>
        <LookupForm onSubmit={fetchCommitHistory} />
        {error && <p className="error">{error}</p>}
        <CommitHistory commits={commits} />
      </div>
    </div>
  );
}

export default App;
