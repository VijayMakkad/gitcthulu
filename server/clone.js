import nodegit from 'nodegit';
import express from 'express';
import cors from 'cors';
import fs from 'fs';

const app = express();
const port = 8080; // Set your desired port

app.use(cors({
    origin: 'http://localhost:1420' // Replace with your React app's origin
  }));

// Function to handle the cloning request (replace 'yourLocalPath' with a dynamic path)
async function cloneRepository(req, res) {
    const { url, path } = req.query; // Get the path from req.query
    const localPath = path || './greeenboi'; // Set a default path if not provided // Replace with a dynamically generated or user-provided path

    // Verify if the path exists
    if (fs.existsSync(localPath)) {
        return res.status(400).json({ message: 'Invalid path' });
    }

    try {
        const repo = await nodegit.Clone(url, localPath);
        console.log(`Cloned '${url}' to '${path}'`);
        res.json({ message: 'Clone successful!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: `Cloning failed: ${err}` });
    }
}

async function getCommitHistory(req, res) {       
        
        //   const url = req.query.url; // Assuming the URL is passed as a query parameter
    const { url, path = 'C:/Users/suvan/projects/vscodex' } = req.query; // Allow optional path query parameter
    if (!url) {
        return res.status(400).json({ message: 'Missing required parameter: url' });
    }

    try {
        const repo = await nodegit.Repository.open(path); // Open the repository

        const revwalk = new repo.createRevWalk(); // Create a RevWalk object

        // Include all branches using lookup flag (optional)
        // revwalk.sortingOptions = nodegit.RevWalk.SORT_TOPOLOGICAL | nodegit.RevWalk.SORT_REVERSE;

        // Iterate over all commits
        const commits = [];
        for await (const commit of revwalk) {
        const commitInfo = await commit.getSignature();

        commits.push({
            sha: commit.sha(),
            author: commitInfo.author().name(),
            email: commitInfo.author().email(),
            date: commitInfo.date().toISOString(),
            message: commit.message(),
            branch: await getBranchName(repo, commit), // Optional: Get branch name (function defined below)
        });
        }

    res.json(commits);
  
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error fetching commit history' });
    }
  }

async function getLatestCommits({repoPath}) {
    try {
      const repo = await nodegit.Repository.open('C:/Users/suvan/web dev/portfolio-blog');
      const headCommit = await repo.getHeadCommit();
    //   const remoteRef = await repo.getReferenceNames(3);
      const remoteRef = await repo.getReferenceCommit("refs/remotes/origin/main");
  
  
      return { remoteCommit: remoteRef.sha(), headCommit: headCommit.sha()};
    } catch (error) {
      console.error(error);
      return { error: error.message };
    }
  }
  
  app.get('/compare-commits', async (req, res) => {
    
    const repoPath = 'C:/Users/suvan/projects/git_tauri/';
  
    const commits = await getLatestCommits(repoPath);
  
    if (commits.error) {
      return res.status(500).json({ message: commits.error });
    }
  
    const isSameCommit = commits.localCommit === commits.remoteCommit;
    console.log('hello')
    res.json({
      localCommit: commits.localCommit,
      remoteCommit: commits.remoteCommit,
      isSameCommit,
        // remoteRef: commits.remoteRef
    });
  });

  



app.get('/commits', getCommitHistory);

// Endpoint to trigger cloning
app.get('/clone', cloneRepository);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});