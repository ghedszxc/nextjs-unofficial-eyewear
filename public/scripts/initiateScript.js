// JQuery
(function (a, b, c, d) {
  a = `https://code.jquery.com/jquery-3.6.1.min.js`;
  b = document;
  c = "script";
  d = b.createElement(c);
  d.src = a;
  d.type = "text/javascript";
  d.async = true;
  a = b.getElementsByTagName(c)[1];
  a.parentNode.insertBefore(d, a);
})();

// Tealium
(function (a, b, c, d) {
  a = `https://tags.tiqcdn.com/utag/luxottica/unofficial/dev/utag.js?v=${new Date().valueOf()}`;
  b = document;
  c = "script";
  d = b.createElement(c);
  d.src = a;
  d.type = "text/java" + c;
  d.async = true;
  a = b.getElementsByTagName(c)[1];
  a.parentNode.insertBefore(d, a);
})();

function TealiumConsentPrivacyLink() {
  location.href = this.location.origin + "/privacy_redirect";
}

// Data 2 track
(function () {
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.innerHTML = `
    var tealium_data2track = [];
    tealium_data2track.push(window.tealiumData);
  `;
  document.getElementsByTagName("head")[0].appendChild(script);
})();
