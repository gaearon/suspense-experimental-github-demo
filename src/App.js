import React, { Suspense } from 'react';
import { Router } from './router';
import ErrorBoundary from './ErrorBoundary';
import Spinner from './Spinner';

function App() {
  return (
    <Layout>
      <Router />
    </Layout>
  )
}

function Layout({ children }) {
  return (
    <div className="App">
      <header className="App-header">
        <ErrorBoundary fallback={<h1>Oops! Check the console.</h1>}>
          <Suspense fallback={<Spinner isBig={true} />}>
            {children}
          </Suspense>
        </ErrorBoundary>
      </header>
    </div>
  );
}

export default App;
