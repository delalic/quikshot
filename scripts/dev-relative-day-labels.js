(function () {
  var timeZone = "America/New_York";
  var formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });

  function easternDateString(date) {
    var parts = formatter.formatToParts(date).reduce(function (result, part) {
      result[part.type] = part.value;
      return result;
    }, {});

    return [parts.year, parts.month, parts.day].join("-");
  }

  function labelDates() {
    var today = easternDateString(new Date());
    var yesterday = easternDateString(new Date(Date.now() - 24 * 60 * 60 * 1000));

    document.querySelectorAll(".activity-day").forEach(function (section) {
      var date = section.dataset.activityDate;
      var heading = section.querySelector(".activity-date");
      if (!date || !heading) {
        return;
      }

      var fullDate = heading.dataset.fullDate || heading.textContent;
      var label = fullDate;
      if (date === today) {
        label = "Today";
      } else if (date === yesterday) {
        label = "Yesterday";
      }

      heading.textContent = label;
      if (label !== fullDate) {
        heading.setAttribute("aria-label", label + ", " + fullDate);
        heading.title = fullDate;
      } else {
        heading.removeAttribute("aria-label");
        heading.removeAttribute("title");
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", labelDates);
  } else {
    labelDates();
  }

  window.addEventListener("pageshow", labelDates);
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState !== "hidden") {
      labelDates();
    }
  });
}());
