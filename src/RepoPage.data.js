import { fetchRepo, fetchRepoContribs } from './api';

// Data dependencies are a separate file tree colocated with the component tree.
// Tools like Relay automate creating these files, but here we'll do it by hand.
//
// We put it into another file so that we can load the data dependencies
// *without* any of the UI code for the corresponding screen. This lets
// us kick off a fetch early (e.g. on navigation) before UI code is loaded.
// You can verify this happens by enabling "Slow 3G" in Chrome Network pane
// and see the bundle and data requests go out in parallel.

export default function prepareRepoPage(repoId) {
  return {
    repo: fetchRepo(repoId),
    contribs: fetchRepoContribs(repoId),
  }
}
