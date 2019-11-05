# Suspense Demo for Library Authors

## ⚠️ Warning: Highly Experimental ⚠️

I made this demo to complement [Suspense for Data Fetching](https://reactjs.org/docs/concurrent-mode-suspense.html) and [Concurrent UI Patterns](https://reactjs.org/docs/concurrent-mode-patterns.html) documentation. **It is highly experimental and primarily aimed at library authors!**

It shows a few techniques relevant to Suspense:

* **Render-as-you-fetch:** In production we use Relay Hooks which have an API for [preloading data](https://relay.dev/docs/en/experimental/api-reference#usepreloadedquery). However, we've seen many questions from people who are confused about [how this pattern differs](https://reactjs.org/docs/concurrent-mode-suspense.html#traditional-approaches-vs-suspense) from the prevalent "fetch-on-render" like `componentDidMount`. This demos implements "render-as-you-fetch" with REST manually using a separate "data dependency" tree hierarchy. If you're familiar with Next.js `getInitialProps`, this is similar, but in a tree shape. (Hint: Relay generates similar files automatically by extracting GraphQL queries from components, but we'll do this manually.)
* **useTransition:** We're showing two examples of `useTransition` in our hand-written router. One example shows each `Link` transitioning to a "waiting" cursor if loading takes more than 500ms. Another example shows a global loading indicator in the top left corner if loading data after clicking the Back button takes too long. To reproduce both, you'll want to open "Network" in Chrome DevTools, check "Disable Cache" and choose "Slow 3G". Then try to click something and later press Back.
* **SuspenseList:** There is a small demo of using SuspenseList to enforce a particular sequence of revealing loading states. This prevents the page from jumping as content loads in. You can see it on the User page.

## Code + Data in Parallel

If there's one thing to take away from this example, it's that **code and data for a page load in parallel**. To verify this, enable "Slow 3G" and "Disable Cache" in Chrome Network panel:

<img alt="network settings" src="https://i.imgur.com/UumoFz0.png">

Then watch the initial load:

<img alt="load code and data and parallel" src="https://i.imgur.com/NruRXWf.png">

You can see code for the route and its data loads in parallel. If you click a link, you'll see that data is also requested immediately -- we're not fetching for the code to load (which can take a while) to start fetching its data.

You might be wondering: how is this different from *always* fetching all the data? This might seem similar to how routing systems worked before fetch-on-render became popular. However, the crucial difference is that **we can show content as soon as we have enough data — while some of it is still being fetched**. The User page shows an example of this: it only "waits" for the user profile data, but wraps less important parts into Suspense so they can render when they're ready. A SuspenseList then coordinates their reveal so the page doesn't jump due to out-of-order responses.

Also note that **we don't centralize the data fetching logic in one place -- instead, it forms a parallel file tree to our components**. In the actual Relay code, we don't need to do that because a compiler creates that "parallel tree" for us by extracting fragments from React components. So there are multiple ways we could accomplish this, but I went for a manual one in this example to demonstrate the mechanics. We don't want to leave the data fetching code *in* the component because then we lose the ability to load its code and data in parallel.

To sum up, Suspense lets us combine the technically optimal solution (start fetching UI and code as early as we know we'll need them in parallel) with a solution that's optimal for human perception (loading states placed at intentional boundaries, with a reveal order that prevents jumps).

## Exploring the Project

I recommend to walk through every file and check out the comments. Also, play with it locally! It's fun. Try adding a screen or changing existing ones.

Note that GitHub will give you 403 if you send too many requests.

## Caveats

* All of this is very experimental. Don't rely on this in production yet! The actual APIs recommended for Suspense data fetching in REST might end up pretty different. This is just my first exploration.
* I didn't finish some things routers typically implement, like scroll restoration.
* There is no in-memory caching implemented at all! The back navigation is only snappy by default because the browser caches responses. (Although you should try disabling the cache and see what happens!) If you feel adventurous, you can try implementing your own cache. Relay does that. A simple one could even live in our router component.
* There are still some cases with flashing spinners and jumping layouts. I think there might be a bug in React in one case, I haven't looked at all of them. Don't take them as a representation of what the final Concurrent Mode release will look like.
* I might have messed up something up! I haven't actually verified this example with anyone on the React team, but I think it works.

## Available Scripts

* `yarn start` for development mode.
* `yarn build` for production mode.
