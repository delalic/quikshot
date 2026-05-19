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

  function isVisible() {
    return document.visibilityState !== "hidden";
  }

  function reloadFresh() {
    window.location.replace(refreshUrl());
  }

  function checkForUpdate() {
    if (!isVisible() || inFlight || !currentSignature) {
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
          reloadFresh();
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
    if (timer !== null || !isVisible()) {
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

  function checkAndPoll() {
    if (!isVisible()) {
      return;
    }

    checkForUpdate();
    startPolling();
  }

  function scheduleVisibleCheck() {
    window.setTimeout(checkAndPoll, 0);
  }

  document.addEventListener("visibilitychange", function () {
    if (isVisible()) {
      scheduleVisibleCheck();
    } else {
      stopPolling();
    }
  });

  window.addEventListener("focus", scheduleVisibleCheck);
  window.addEventListener("pageshow", scheduleVisibleCheck);
  window.addEventListener("pagehide", stopPolling);

  startPolling();
  scheduleVisibleCheck();
}());
