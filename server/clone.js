import nodegit from 'nodegit';
import express from 'express';

const app = express();
const port = 8080; // Set your desired port

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

// Endpoint to trigger cloning
app.get('/clone', cloneRepository);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});