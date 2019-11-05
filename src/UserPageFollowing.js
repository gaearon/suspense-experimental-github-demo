import React from 'react';
import { Link } from './router';

export default function UserPageFollowing({ following }) {
  const json = following.read();
  return (
    <div>
      <h2>Following</h2>
      {json.length === 0 && <p>Not following anyone!</p>}
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
