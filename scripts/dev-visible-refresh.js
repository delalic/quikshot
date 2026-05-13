(function () {
  var script = document.currentScript;
  var intervalMs = Number(script && script.dataset.refreshIntervalMs) || 300000;
  var rootSelector = script && script.dataset.refreshRoot;
  var sourceUrl = new URL((script && script.dataset.refreshUrl) || window.location.href, window.location.href);
  var currentSignature = readSignature(document);
  var timer = null;
  var inFlight = false;

  function readSignature(sourceDocument) {
    var root = rootSelector ? sourceDocument.querySelector(rootSelector) : sourceDocument.body;
    if (!root) {
      return "";
    }

    return root.textContent.replace(/\s+/g, " ").trim();
  }

  function refreshUrl() {
    var url = new URL(sourceUrl.href);
    url.searchParams.set("_refresh", String(Date.now()));
    return url.href;
  }

  function checkForUpdate() {
    if (document.visibilityState !== "visible" || inFlight || !currentSignature) {
      return;
    }

    inFlight = true;
    fetch(refreshUrl(), { cache: "no-store" })
      .then(function (response) {
        if (!response.ok) {
          return "";
        }
        return response.text();
      })
      .then(function (html) {
        if (!html) {
          return;
        }

        var nextDocument = new DOMParser().parseFromString(html, "text/html");
        var nextSignature = readSignature(nextDocument);
        if (nextSignature && nextSignature !== currentSignature) {
          window.location.reload();
        }
      })
      .catch(function () {
        // Ignore transient network/cache failures; the next visible poll will retry.
      })
      .finally(function () {
        inFlight = false;
      });
  }

  function startPolling() {
    if (timer !== null || document.visibilityState !== "visible") {
      return;
    }

    timer = window.setInterval(checkForUpdate, intervalMs);
  }

  function stopPolling() {
    if (timer === null) {
      return;
    }

    window.clearInterval(timer);
    timer = null;
  }

  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible") {
      checkForUpdate();
      startPolling();
    } else {
      stopPolling();
    }
  });

  startPolling();
}());
