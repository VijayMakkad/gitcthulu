import nodegit from 'nodegit';
import express from 'express';

const app = express();
const port = 3000; // Adjust the port as needed

async function getCommitHistory(req, res) {
  try {
    const { url, path = '' } = req.query; // Allow optional path query parameter

    if (!url) {
      return res.status(400).json({ message: 'Missing required parameter: url' });
    }

    const repo = await nodegit.Repository.open(url); // Open the Git repository

    const headCommit = await repo.Head(); // Get the HEAD commit
    const history = await headCommit.history({ path }); // Get commit history (optionally filter by path)

    const commitData = await Promise.all(
      history.map(async (commit) => ({
        sha: commit.sha(),
        message: commit.message(),
        author: commit.author().name(),
        date: commit.date().toString(),
      }))
    );

    res.json({ commits: commitData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching commit history' });
  }
}

app.get('/commits', getCommitHistory);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});