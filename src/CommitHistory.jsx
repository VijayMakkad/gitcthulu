import React from 'react';

const CommitHistory = ({ commits }) => {
  if (!commits) {
    return <p>Loading...</p>;
  }

  if (!commits.length) {
    return <p>No commits found.</p>;
  }

  return (
    <ul>
      {commits.map((commit) => (
        <li key={commit.sha}>
          SHA: {commit.sha} - Message: {commit.message} (by {commit.author} on {commit.date})
        </li>
      ))}
    </ul>
  );
};

export default CommitHistory;