import createRouter from './createRouter';
import prepareRepoPage from './RepoPage.data';
import prepareUserPage from './UserPage.data';

const { Router, Link } = createRouter([{
  match: '/users/',
  loadData: prepareUserPage,
  loadCode: () => import('./UserPage'),
}, {
  match: '/repos/',
  loadData: prepareRepoPage,
  loadCode: () => import('./RepoPage'),
}]);

export { Router, Link };
