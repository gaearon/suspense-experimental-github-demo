import React, { useLayoutEffect, Suspense, SuspenseList } from 'react';
import UserPageStars from './UserPageStars';
import UserPageFollowing from './UserPageFollowing';

export default function UserPage({ user, following, stars }) {
  useLayoutEffect(() => {
    // A proper router would help you with this
    window.scrollTo(0, 0)
  }, [user]);
  return (
    <div>
      {/* Required. Links wait for this to load before forcing a big spinner. */}
      <UserDetails user={user} />
      {/* Always show top-down one by one for smoother loading */}
      <SuspenseList revealOrder="forwards" tail="collapsed">
        <hr />
        {/* This doesn't block initial render because of Suspense boundary. */}
        <Suspense fallback={<h2>Loading stars...</h2>}>
          <UserPageStars stars={stars} />
        </Suspense>
        <hr />
        {/* This doesn't block initial render because of Suspense boundary. */}
        <Suspense fallback={<h2>Loading following...</h2>}>
          <UserPageFollowing following={following} />
        </Suspense>
      </SuspenseList>
    </div>
  );
}

function UserDetails({ user, stars }) {
  const json = user.read();
  return (
    <div>
      <h1>{json.name}</h1>
      <h2>{json.login}</h2>
    </div>
  )
}