# Suspense Demo for Library Authors

## ⚠️ Warning: Highly Experimental ⚠️

I made this demo to complement [Suspense for Data Fetching](https://reactjs.org/docs/concurrent-mode-suspense.html) and [Concurrent UI Patterns](https://reactjs.org/docs/concurrent-mode-patterns.html) documentation. **It is highly experimental and primarily aimed at library authors!**

**For a full explanation about this particular demo, [read here](https://gist.github.com/gaearon/71a03edb0645685c1119c80ecad1d082).** It uses a REST GitHub API with render-as-you-fetch pattern and a custom router.

## A Better Demo

This demo took me a few hours and it's pretty rough. Its goal was to show one possible way to integrate Suspense with REST APIs without losing benefits of render-as-you-fetch paradigm.

After I published this, I realized Relay team has already built a more detailed demo [here](https://github.com/relayjs/relay-examples/tree/master/issue-tracker/) with cool features such as preloading on link hover--and [its router](https://github.com/relayjs/relay-examples/tree/master/issue-tracker/src/routing) is not even technically tied to Relay! So you might want to check out that one and compare them.

We plan to unify these demos to use shared infrastructure in the near term so the similarities and differences are more obvious.
