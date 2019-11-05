import React, { createContext, lazy, useState, useCallback, useContext, useEffect, useTransition } from 'react';
import { unstable_runWithPriority, unstable_UserBlockingPriority } from 'scheduler';
import Spinner from './Spinner';

if (window.location.pathname === '/') {
  // Reload to our initial page.
  window.location.pathname = '/repos/facebook/react';
}

// This is a hand-written router.
// It doesn't fix cross-browser quirks or do scroll restoration.
// Don't copy paste this into your project--it's meant as a demo
// for what routers in the React ecosystem could do in the future.

const RouterContext = createContext(null);

// Don't forget these APIs are experimental and can change.
const suspenseConfig = {
  timeoutMs: 5000,
  busyDelayMs: 500, // Before we show the inline spinner
  busyMinDurationMs: 100, // If we show it, force it to stick for a bit
};

export default function createRouter(routes) {
  const initialRoute = loadRoute(window.location.pathname);

  // If there's one thing you should take away, it's here!
  // We start loading *both* code and data for the next screen
  // in parallel, *at the very moment* you navigate.
  // We *don't* wait for code to start loading data.
  function loadRoute(url) {
    for (let route of routes) {
      if (url.startsWith(route.match)) {
        const params = url.substring(route.match.length);
        const props = route.loadData(params);
        // Start loading code in parallel:
        route.loadCode();
        // Start rendering immediately:
        let Page = route.component;
        if (!Page) {
          Page = route.component = lazy(route.loadCode);
        }
        return <Page {...props} />;
      }
    }
    throw new Error('Not found.');
  }

  // This router is a very naïve and just shows a proof of concept.
  function Router() {
    const [route, setRoute] = useState(initialRoute);
    const [startTransition, isPending] = useTransition(suspenseConfig);

    // Our Links will call this to navigate.
    let navigate = useCallback((url, pushState) => {
      // Start fetching and rendering immediately on navigation.
      // Data and code are fetched in parallel.
      const nextRoute = loadRoute(url);
      setRoute(nextRoute);
      if (pushState) {
        window.history.pushState(null, null, url);
      }
    }, []);

    // Listen to browser history changes.
    useEffect(() => {
      let handlePopState = () => {
        // Note: this is a bit icky. We don't have a stable API for this yet.
        unstable_runWithPriority(unstable_UserBlockingPriority, () => {
          // Handle the browser Back Button.
          startTransition(() => {
            navigate(window.location.pathname, false)
          });
        });
      };
      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    });

    return (
      <RouterContext.Provider value={navigate}>
        {isPending && (
          /*
           * Open Chrome DevTools, go to Network,
           * check "Disable Cache" and enable "Slow 3G".
           * Then try navigating and pressing the Back button.
           */
          <div className="TopLeftAbsoluteSpinner">
            <Spinner />
          </div>
        )}
        {route}
      </RouterContext.Provider>
    );
  }

  function Link({ url, children }) {
    const navigate = useContext(RouterContext);
    const [startTransition, isPending] = useTransition(suspenseConfig)

    function handleClick(e) {
      if (!shouldNavigate(e)) {
        return;
      }
      e.preventDefault();
      startTransition(() => {
        navigate(url, true);
      });
    }

    return (
      <span>
        <a
          href={url}
          onClick={handleClick}
          /*
           * Open Chrome DevTools, go to Network,
           * check "Disable Cache" and enable "Slow 3G".
           * Then click on a link and wait 500ms.
           */
          className={isPending ? "DelayedWaitCursor" : null}
        >
          {children}
        </a>
      </span>
    );
  }

  return {
    Router,
    Link,
  };
}

// Copied from @reach/router, written by Ryan Florence.
function shouldNavigate(event) {
  return (
    !event.defaultPrevented &&
    event.button === 0 &&
    !(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
  );
};