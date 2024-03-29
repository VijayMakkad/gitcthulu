import nodegit from 'nodegit';
import express from 'express';
import cors from 'cors';

const app = express();
const port = 8080; // Set your desired port

app.use(cors({
    origin: 'http://localhost:1420' // Replace with your React app's origin
  }));

// Function to handle the cloning request (replace 'yourLocalPath' with a dynamic path)
async function cloneRepository(req, res) {
  const url = req.query.url || 'https://github.com/greeenboi/mobile_Chatapp'; // Allow URL customization via query string
  const localPath = './greeenboi'; // Replace with a dynamically generated or user-provided path

  try {
    const repo = await nodegit.Clone(url, localPath);
    console.log(`Cloned '${path.basename(url)}' to '${repo.workdir()}'`);
    res.json({ message: 'Clone successful!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Cloning failed' });
  }
}

async function getCommitHistory(req, res) {
    try {
      const { url, path = 'C:/Users/suvan/projects/vscodex' } = req.query; // Allow optional path query parameter
  
      if (!url) {
        return res.status(400).json({ message: 'Missing required parameter: url' });
      }
  
      const repo = await nodegit.Repository.open(path); // Open the Git repository
  
      const headCommit = await repo.getHeadCommit(); // Get the HEAD commit
      const commit = headCommit.history(); // Get the commit history

    //   const history = await commit.history({ reverse: true }); // Get commit history
  
      const commits = [];
    //   for (const com of commit) {
    //     const commitInfo = await com.getSignature(); // Get commit information
  
    //     commits.push({
    //       sha: com.sha(),
    //       author: commitInfo.author().name(),
    //       email: commitInfo.author().email(),
    //       date: commitInfo.date().toISOString(),
    //       message: com.message(),
    //     });
    //   }
  
      res.json(commit);
  
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error fetching commit history' });
    }
  }
  


app.get('/commits', getCommitHistory);

// Endpoint to trigger cloning
app.get('/clone', cloneRepository);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});