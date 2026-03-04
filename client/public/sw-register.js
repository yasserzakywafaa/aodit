// Register service worker
if ("serviceWorker" in window.navigator) {
  navigator.serviceWorker
    .register("/serviceworker.js")
    .then((registration) => {
      console.log("ServiceWorker:>>> Registered successfully");

      // Check for updates every 60 seconds
      setInterval(() => {
        registration.update();
      }, 60000);

      // Handle updates
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;

        if (newWorker) {
          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              console.log("ServiceWorker:>>> New version available");

              // Automatically activate the new service worker
              newWorker.postMessage({ type: "SKIP_WAITING" });
            }
          });
        }
      });
    })
    .catch((error) => {
      console.error("ServiceWorker:>>> Registration failed:", error);
    });
}

// Handle controller change (when new SW activates)
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    const reloadOnce = localStorage.getItem("SW_RELOAD_ONCE");

    // Only reload once per SW update
    if (!reloadOnce) {
      console.log("ServiceWorker:>>> Controller changed, reloading page");
      localStorage.setItem("SW_RELOAD_ONCE", "true");
      window.location.reload();
    } else {
      console.log(
        "ServiceWorker:>>> Controller changed but already reloaded once",
      );
    }
  });
}

// Clear the reload flag on page load (after successful reload)
// This allows the next SW update to trigger a reload again
window.addEventListener("load", () => {
  // Give it a second to ensure the page is fully loaded
  setTimeout(() => {
    if (localStorage.getItem("SW_RELOAD_ONCE") === "true") {
      // Only clear if we're authenticated or on login page
      // This prevents clearing it during the logout flow
      const isAuthenticated = localStorage.getItem("isAuthenticated");
      if (isAuthenticated !== "false") {
        localStorage.removeItem("SW_RELOAD_ONCE");
      }
    }
  }, 1000);
});
