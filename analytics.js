/* Self-hosted Umami (the instance on the Hetzner box, shared with Nestory). Cookie-free: no
   cookie, no device ID, nothing personal. Both values are public; they ship in the page.
   Off until WEBSITE_ID is set, and off anywhere but kwiz.live (local previews don't count).
   Clicks on elements with data-umami-event are tracked by Umami itself; index.html also
   sends a "waitlist-signup" event. */
(function () {
  var HOST = 'https://analytics.nestory.homes';
  var WEBSITE_ID = '390a052a-daca-4ed4-9898-22a8aa2380ce';
  if (!WEBSITE_ID || location.hostname !== 'kwiz.live') return;
  var s = document.createElement('script');
  s.defer = true;
  s.src = HOST + '/script.js';
  s.setAttribute('data-website-id', WEBSITE_ID);
  s.setAttribute('data-domains', 'kwiz.live');
  document.head.appendChild(s);
})();
