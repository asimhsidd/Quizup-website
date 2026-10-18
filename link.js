// The share-link landing pages: kwiz.live/c/<token> (a challenge) and /i/<code> (an invite).
// With KWIZ installed, Android opens these links in the app (App Links: .well-known/assetlinks.json)
// and this page never shows. Without it, the page says who sent the link and sends the player
// to Google Play. The Play link carries the link in Google's install referrer, so after the
// install KWIZ opens straight into the challenge (Quizup frontend/src/lib/installReferrer.js).
// Nothing is playable on the web. Data: GET <api>/api/links/c/<token> | /i/<code>
// (Quizup backend/routes/links.js).
(function () {
  var API = location.hostname === 'kwiz.live' ? 'https://api.kwiz.live' : 'http://localhost:3001';
  var PACKAGE = 'live.kwiz.app';

  var m = location.pathname.match(/^\/(c|i)\/([A-Za-z0-9]{1,16})\/?$/);
  var kind = m && m[1];
  var id = m && m[2];
  var ua = navigator.userAgent;
  var isIOS = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);

  var $ = function (sel) { return document.querySelector(sel); };
  function show(sel) { $(sel).hidden = false; }
  function text(sel, value) { document.querySelectorAll(sel).forEach(function (el) { el.textContent = value; }); }

  var playUrl = 'https://play.google.com/store/apps/details?id=' + PACKAGE
    + (kind ? '&referrer=' + encodeURIComponent(kind + '=' + id) : '');
  // "Already have KWIZ?": open this link in the app, or the Play listing if it isn't there
  var appUrl = 'intent://' + location.host + location.pathname + '#Intent;scheme=https;package=' + PACKAGE
    + ';S.browser_fallback_url=' + encodeURIComponent(playUrl) + ';end';
  document.querySelectorAll('[data-play]').forEach(function (a) { a.href = playUrl; });
  document.querySelectorAll('[data-open-app]').forEach(function (a) { a.href = appUrl; });

  function avatar(user) {
    var box = $('#avatar');
    box.textContent = '';
    if (user.avatarUrl && /^https?:\/\//.test(user.avatarUrl)) {
      var img = document.createElement('img');
      img.alt = '';
      img.src = user.avatarUrl;
      img.onerror = function () { box.textContent = (user.username || '?').charAt(0).toUpperCase(); };
      box.appendChild(img);
    } else {
      box.textContent = (user.username || '?').charAt(0).toUpperCase();
    }
  }

  function ready() {
    $('#loading').hidden = true;
    show('#main');
    show(isIOS ? '#ios' : '#android');
  }

  function gone(title, body) {
    $('#loading').hidden = true;
    text('#gone-title', title);
    text('#gone-body', body);
    show('#gone');
    $('#step3').hidden = true; // no friend to name
    show(isIOS ? '#ios' : '#android');
  }

  if (!kind) { gone('Link not found', 'Ask your friend to send it again.'); return; }

  fetch(API + '/api/links/' + kind + '/' + id)
    .then(function (res) {
      if (res.status === 404) return { missing: true };
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    })
    .then(function (d) {
      if (d.missing) {
        gone('Link not found', 'Ask your friend to send it again.');
      } else if (kind === 'c' && d.expired) {
        gone('Challenge expired', 'Challenge links last 7 days. Get KWIZ and challenge your friend back.');
      } else if (kind === 'c') {
        var who = d.challenger.username;
        avatar(d.challenger);
        text('[data-who]', who);
        text('#topic', d.topicName);
        if (d.played) {
          show('#card-played');
        } else if (d.challengerScore != null) {
          text('#score', d.challengerScore);
          text('#total', '/' + d.totalQuestions);
          show('#card-score');
        } else {
          show('#card-first');
        }
        document.title = who + ' challenged you on KWIZ';
        ready();
      } else {
        avatar(d.inviter);
        text('[data-who]', d.inviter.username);
        document.title = d.inviter.username + ' invited you to KWIZ';
        ready();
      }
    })
    .catch(function () {
      gone('Couldn’t load this link', 'Check your connection and try again, or get KWIZ from Google Play.');
    });

  // iPhone: the launch waitlist (Quizup backend/routes/waitlist.js), like the home page's
  var form = $('#notify');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = $('#notify-status');
      var email = form.email.value.trim();
      if (!email) return;
      status.textContent = 'Saving…';
      fetch(API + '/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, website: form.website.value }),
      })
        .then(function (res) { return res.json().then(function (body) { return { ok: res.ok, body: body }; }); })
        .then(function (r) {
          if (!r.ok) throw new Error(r.body.error || 'Something went wrong');
          status.textContent = 'You’re on the list. We’ll email you the day KWIZ lands on iPhone.';
          form.reset();
          if (window.umami) window.umami.track('waitlist-signup', { from: kind === 'c' ? 'challenge-link' : 'invite-link' });
        })
        .catch(function (err) { status.textContent = err.message || 'Something went wrong. Try again?'; });
    });
  }
})();
