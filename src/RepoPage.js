import React, { useLayoutEffect } from 'react';
import { Link } from './router';

export default function RepoPage({ repo, contribs }) {
  useLayoutEffect(() => {
    // A proper router would help you with this
    window.scrollTo(0, 0)
  }, [repo]);
  return (
    <div>
      <RepoDetails repo={repo} />
      <hr />
      <RepoContributors contribs={contribs} />
    </div>
  );
}

function RepoDetails({ repo }) {
  const json = repo.read();
  return (
    <h1>
      {json.name}
    </h1>
  );
}

function RepoContributors({ contribs }) {
  const json = contribs.read();
  return (
    <div>
      <h2>Contributors</h2>
      {json.length === 0 && <p>No contributors!</p>}
      <ul>
        {json.map(({login, id}) => (
          <li key={id}>
            <Link url={`/users/${login}`}>{login}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
