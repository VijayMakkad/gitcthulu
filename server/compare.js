import express from 'express';
import nodegit from 'nodegit';

const app = express();
async function getLatestCommits() {
    try {
      const repo = await nodegit.Repository.open('C:/Users/suvan/projects/git_tauri/');
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
    // Replace with your actual Git repository path
    const repoPath = 'C:/Users/suvan/projects/git_tauri/';
  
    const commits = await getLatestCommits();
  
    if (commits.error) {
      return res.status(500).json({ message: commits.error });
    }
  
    const isSameCommit = commits.localCommit === commits.remoteCommit;
  
    res.json({
      localCommit: commits.localCommit,
      remoteCommit: commits.remoteCommit,
      isSameCommit,
        // remoteRef: commits.remoteRef
    });
  });
  
  const port = 8080;
  
  app.listen(port, () => console.log(`Server listening on port ${port}`));  