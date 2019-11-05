export function fetchRepo(repoId) {
  return wrapPromise(getFromGitHub(`/repos/${repoId}`));
}

export function fetchRepoContribs(repoId) {
  return wrapPromise(getFromGitHub(`/repos/${repoId}/contributors`));
}

export function fetchUser(userId) {
  return wrapPromise(getFromGitHub(`/users/${userId}`));
}

export function fetchUserStars(userId) {
  return wrapPromise(getFromGitHub(`/users/${userId}/starred`));
}

export function fetchUserFollowing(userId) {
  return wrapPromise(getFromGitHub(`/users/${userId}/following`));
}

async function getFromGitHub(url) {  
  const response = await fetch('https://api.github.com' + url);
  if (response.status !== 200) {
    throw new Error('GitHub API returned Error ' + response.status);
  }
  return response.json();
}

// Note: this is a simplified implementation.
// Don't copy paste this into your project!
// This particular contract will likely change.
// Projects like Relay implement a more fleshed out version of this.
function wrapPromise(promise) {
  let status = "pending";
  let result;
  let suspender = promise.then(
    r => {
      status = "success";
      result = r;
    },
    e => {
      status = "error";
      result = e;
    }
  );
  return {
    read() {
      if (status === "pending") {
        throw suspender;
      } else if (status === "error") {
        throw result;
      } else if (status === "success") {
        return result;
      }
    }
  };
}
