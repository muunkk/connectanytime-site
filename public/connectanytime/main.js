'use strict';

// Which app fits this device? Returns 'mac' | 'ios' | 'android' | 'other'.
// Pure: takes a navigator-like object so it can be tested in node.
function detectPlatform(nav) {
  nav = nav || {};
  const ua = String(nav.userAgent || '');
  const platform = String(nav.platform || '');
  const hint = nav.userAgentData && typeof nav.userAgentData.platform === 'string' ? nav.userAgentData.platform : '';
  const touch = Number(nav.maxTouchPoints) > 1;

  if (/android/i.test(hint) || /android/i.test(ua)) return 'android';
  if (/iphone|ipod|ipad/i.test(ua) || /iphone|ipod|ipad/i.test(platform) || /^ios$/i.test(hint)) return 'ios';
  // userAgentData, when present, names the OS directly ("macOS", "Windows", "Linux", "Chrome OS"…).
  if (hint) return /^macos$/i.test(hint) ? (touch ? 'ios' : 'mac') : 'other';
  // iPadOS Safari reports itself as a Mac; only the touch points give it away.
  if (/^mac/i.test(platform) || /macintosh|mac os x/i.test(ua)) return touch ? 'ios' : 'mac';
  return 'other';
}

const OSES = ['mac', 'ios', 'android'];

// Put the visitor's platform first: primary hero button and featured card.
// Moves DOM nodes (not just CSS order) so tab order matches what is on screen.
function applyPlatform(os) {
  const known = OSES.includes(os);
  document.documentElement.dataset.platform = os;

  const get = document.querySelector('[data-get]');
  const main = get.querySelector('[data-get-main]');
  const note = get.querySelector('[data-get-note]');
  const also = get.querySelector('[data-get-also]');
  const alsoList = get.querySelector('[data-get-also-list]');
  const links = OSES.map((k) => get.querySelector(`a[data-os="${k}"]`));

  links.forEach((link) => {
    const primary = link.dataset.os === os;
    link.classList.toggle('btn-primary', primary);
    link.classList.toggle('btn-secondary', known && !primary);
    link.classList.toggle('btn-strong', !known);
    link.querySelector('.btn-label').textContent = primary ? link.dataset.label : link.dataset.short;
    if (primary || !known) main.insertBefore(link, note);
    else alsoList.appendChild(link);
  });
  note.textContent = known
    ? links[OSES.indexOf(os)].dataset.note
    : 'ConnectAnytime runs on Mac, iPhone and Android.';
  also.hidden = !known;
  get.classList.toggle('is-equal', !known);

  const bento = document.querySelector('[data-bento]');
  const cards = OSES.map((k) => bento.querySelector(`[data-os="${k}"]`));
  cards.forEach((card) => bento.appendChild(card)); // restore Mac, iPhone, Android order
  if (known) bento.prepend(cards[OSES.indexOf(os)]);
  cards.forEach((card) => {
    const mine = card.dataset.os === os;
    card.classList.toggle('featured', mine);
    card.querySelector('[data-mine]').hidden = !mine;
  });
  bento.classList.toggle('is-equal', !known);
}

// The four steps panel: plays Cisco's sequence with ConnectAnytime doing three of them.
function setUpDemo() {
  const panel = document.querySelector('[data-demo]');
  if (!panel) return;
  const button = panel.querySelector('[data-connect]');
  const approveButton = panel.querySelector('[data-approve]');
  const status = panel.querySelector('[data-status]');
  const working = panel.querySelector('[data-working]');
  const steps = Array.from(panel.querySelectorAll('[data-step]'));
  const live = document.querySelector('[data-live]');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  const STATUS = { idle: 'Not connected', connecting: 'Connecting…', duo: 'Connecting…', connected: 'Connected' };
  const BUTTON = { idle: 'Connect', connecting: 'Cancel', duo: 'Cancel', connected: 'Disconnect' };
  const DUO_AUTO_APPROVE_MS = 4000;
  let timers = [];

  const say = (text) => { live.textContent = text; };
  // Pacing only; with reduced motion every step lands at once.
  const after = (ms, fn) => { timers.push(setTimeout(fn, reduced.matches ? 0 : ms)); };
  const clearTimers = () => { timers.forEach(clearTimeout); timers = []; };

  function setState(state) {
    panel.dataset.state = state;
    status.textContent = STATUS[state];
    button.textContent = BUTTON[state];
  }
  function mark(i, progress) { steps[i].dataset.progress = progress; }
  function work(i, text) { mark(i, 'active'); working.textContent = text; }

  function reset(message) {
    clearTimers();
    steps.forEach((step) => { delete step.dataset.progress; });
    setState('idle');
    say(message);
  }

  function connect() {
    setState('connecting');
    say('Connecting. ConnectAnytime types your password and “push” for you.');
    work(0, 'Typing your password…');
    after(700, () => {
      mark(0, 'done');
      work(1, 'Typing “push”…');
      after(650, () => {
        mark(1, 'done');
        mark(2, 'active');
        setState('duo');
        say('Duo push sent to your phone. Approve it to continue.');
        // Real time even with reduced motion, so there is a chance to press Approve.
        timers.push(setTimeout(approveDuo, DUO_AUTO_APPROVE_MS));
      });
    });
  }

  function approveDuo() {
    if (panel.dataset.state !== 'duo') return;
    const hadFocus = document.activeElement === approveButton;
    clearTimers();
    mark(2, 'done');
    setState('connecting');
    work(3, 'Clicking Accept…');
    if (hadFocus) button.focus(); // Approve is about to disappear
    after(650, () => {
      mark(3, 'done');
      setState('connected');
      say('Connected to vpn.shanghai.nyu.edu.');
    });
  }

  button.addEventListener('click', () => {
    const state = panel.dataset.state;
    if (state === 'idle') connect();
    else if (state === 'connected') reset('Disconnected.');
    else reset('Cancelled. Not connected.');
  });
  approveButton.addEventListener('click', approveDuo);
  button.disabled = false;
}

if (typeof document !== 'undefined') {
  document.documentElement.classList.add('js');
  applyPlatform(detectPlatform(navigator));
  setUpDemo();
}

if (typeof module !== 'undefined') module.exports = { detectPlatform };
