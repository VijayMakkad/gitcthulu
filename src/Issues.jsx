import React, { useState, useEffect } from 'react';
import { Octokit } from 'octokit';

const octokit = new Octokit();

async function getAllOpenIssues(owner, repo) {
    const per_page = 100; // You can adjust this value as needed

    // Initialize an empty array to store all issues
    const allIssues = [];
  
    // Iterate through paginated results
    for await (const page of octokit.paginate.iterator('/repos/{owner}/{repo}/issues', {
      owner,
      repo,
      state: 'open',
      per_page,
    })) {
      allIssues.push(...page.data);
    }
  
    // Now you have an array containing all open issues
    console.log(allIssues);
  
    // You can iterate through allIssues and process each issue object
    for (const issue of allIssues) {
      console.log(`Issue Title: ${issue.title}`);
    }
}

function OpenIssuesList({ owner, repo }) {
  const [issues, setIssues] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const fetchedIssues = await getAllOpenIssues(owner, repo);
        setIssues(fetchedIssues);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [owner, repo]); // Re-run on owner or repo change

  if (isLoading) return <p>Loading issues...</p>;

  if (error) return <p>Error fetching issues: {error.message}</p>;

  return (
    <ul>
      {issues.map((issue) => (
        <li key={issue.id}>
          <h3>{issue.title}</h3>
          {/* Additional details about the issue can be displayed here */}
        </li>
      ))}
    </ul>
  );
}

export default OpenIssuesList;