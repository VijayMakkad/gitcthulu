
import { useEffect, useState } from "react";
import gitcthulu from "./assets/gitcthulu.png";
import "./App.css";
import Terminal from "./terminal";
import OpenIssuesList from "./Issues";



function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");
  const [commits, setCommits] = useState(null);
  const [error, setError] = useState(null);
  const [isIssuesOpen, setIsIssuesOpen] = useState(false);
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");

  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  
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
        <button onClick={() => setIsIssuesOpen(!isIssuesOpen)}>
          {isIssuesOpen ? 'Close Issues' : 'Open Issues'}
        </button>
        <button onClick={() => setIsTerminalOpen(!isTerminalOpen)}>
          {isTerminalOpen ? 'Close Terminal' : 'Open Terminal'}
        </button>
      </header>
      {
        isIssuesOpen ? (
            <div className="git-clone">
              <form onSubmit={handleSubmit}>
                <label htmlFor="owner">Owner:</label>
                <input type="text" id="owner" name="owner" value={owner} onChange={(e) => setOwner(e.target.value)} required />
                <label htmlFor="repo">Repository:</label>
                <input type="text" id="repo" name="repo" value={repo} onChange={(e) => setRepo(e.target.value)} required />
                <button type="submit">Fetch Issues</button>
              </form>
              {owner && repo && <OpenIssuesList owner={owner} repo={repo} />}
            </div>
        ) : (
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

        )
      }
      {isTerminalOpen && (
        <div style={isTerminalOpen ? {} : { display: 'none' }}>
          <Terminal />
        </div>
      )}
        
    </div>
  );
}

export default App;
