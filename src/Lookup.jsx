import React, { useState } from 'react';

const LookupForm = ({ onSubmit }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(url);
    setUrl(''); // Clear input field after submission
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="url">Git Repository URL:</label>
      <input
        type="text"
        id="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="e.g., https://github.com/username/repo"
      />
      <button type="submit">Fetch Commit History</button>
    </form>
  );
};

export default LookupForm;