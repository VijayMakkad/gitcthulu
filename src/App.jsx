
import { useEffect, useState } from "react";
import gitcthulu from "./assets/gitcthulu.png";
import "./App.css";
import Terminal from "./terminal";
import OpenIssuesList from "./Issues";
import ChatComponent from "./ChatComponent";



function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");
  const [repoPath, setRepoPath] = useState('');
  const [commits, setCommits] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isIssuesOpen, setIsIssuesOpen] = useState(false);
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");

  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  
  const [url, setUrl] = useState('https://github.com/greeenboi/mobile_Chatapp'); // Default URL
  const [path, setPath] = useState('https://github.com/greeenboi/mobile_Chatapp'); // Default URL
  const [message, setMessage] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMergeEditorOpen, setIsMergeEditorOpen] = useState(false);
  const [isOperationsOpen, setIsOperationsOpen] = useState(true);
  const [sha, setSha] = useState(''); 
  const [commitData, setCommitData] = useState(null);
  


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

  const handleSubmitMergeConflict = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Replace with your API endpoint URL if using a separate server
      const response = await fetch(`http://localhost:8080/compare-commits?repoPath=${repoPath}`);

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setCommits(data);
      setSha(data.remoteCommit);
    } catch (error) {
      console.error(error);
      setError(error.message || 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCommitContent = async () => {
    try {
      const response = await fetch(`http://localhost:8080/commit-content`); 
      const data = await response.json();
      setCommitData(data);
      console.log(data);
    } catch (error) {
      setError(error);
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
          <button onClick={() => { setIsMergeEditorOpen(!isMergeEditorOpen); setIsOperationsOpen(!isOperationsOpen) }}>
            {isMergeEditorOpen ? 'Close Merge Conflict' : 'Open Merge conflict Editor'}
          </button>
        </header>


        {isMergeEditorOpen && (
          <div className="git-clone" style={isMergeEditorOpen ? {} : { display: 'none' }}>
            <h1>Merge Conflict Editor</h1>
            <p>Here you can resolve merge conflicts</p>

            <form onSubmit={handleSubmitMergeConflict}>
              <label htmlFor="repoPath">Git Repository Path:</label>
              <input
                type="text"
                id="repoPath"
                name="repoPath"
                value={repoPath}
                onChange={(e) => setRepoPath(e.target.value)}
                required
              />
              <br />
              <button type="submit" disabled={isLoading}>
                {isLoading ? 'Loading...' : 'check for merge conflicts'}
              </button>
            </form>
            {error && <p className="error">{error}</p>}
            {commits && (
              <div>
                {/* <p>Local Commit: {commits.localCommit}</p>
                <p>Remote Commit: {commits.remoteCommit}</p> */}
                <p>Is there Merge Conflict Issue? : <span style={commits.isSameCommit ? {} : { color: 'coral', textShadow:'-moz-initial' }}>{commits.isSameCommit ? 'No conflict' : `Merge conflict with ${commits.remoteCommit}`}</span></p>
              </div>
            )}

            {/* <button onClick={fetchCommitContent} >
              Fetch Commit Content
            </button> */}
            {/* {commitData && (
              <div>
                <h2>Commit Message</h2>
                 <p>{commitData.message}</p> 
              </div>
            )} */}
            <ChatComponent />

          </div>
        )}


      {
        isIssuesOpen && (
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
        )}
        {isOperationsOpen && (
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

        )}

      {isTerminalOpen && (
        <div style={isTerminalOpen ? {} : { display: 'none' }}>
          <Terminal />
        </div>
      )}
        
    </div>
  );
}

export default App;
