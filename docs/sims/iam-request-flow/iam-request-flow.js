// CANVAS_HEIGHT: 620
// IAM Request Flow — Mermaid sequenceDiagram showing a federated login
// (SAML / OIDC) across four lanes: User, Browser, Identity Provider, Service
// Provider. Bloom: Understand. Interaction = hover tooltips on each message
// (no animation). Messages are numbered; hovering reveals why each step matters.

// Keyed by the autonumber shown on each message arrow.
const stepInfo = {
  '1': 'The user navigates to the protected application. No session cookie exists yet, so the request will be unauthenticated.',
  '2': 'The browser requests a protected resource. The SP sees no valid session and cannot serve it.',
  '3': 'Instead of asking for a password itself, the SP redirects the browser to the trusted Identity Provider with an authentication request. The SP never handles credentials.',
  '4': 'The browser carries the SP\'s authentication request to the IdP.',
  '5': 'The IdP — not the SP — prompts the user for credentials and a second factor (MFA). Authentication happens at exactly one place.',
  '6': 'The user proves identity to the IdP with a password and an MFA factor (push, TOTP, or passkey).',
  '7': 'The IdP mints a signed identity token asserting who the user is, then redirects the browser back to the SP carrying that token.',
  '8': 'The browser presents the signed token to the SP. The token is now the only evidence of identity the SP will trust.',
  '9': 'The SP returns the protected resource only after the token checks pass.'
};

const actorInfo = {
  'User': 'The human principal. Provides credentials and an MFA factor, but only ever to the Identity Provider.',
  'Browser / Client': 'The user agent that shuttles redirects and tokens between the SP and the IdP. It never sees the IdP\'s signing key.',
  'Identity Provider': 'Authenticates the user and issues signed identity tokens. The single source of truth for "who is this?" — compromise here affects every connected SP.',
  'Service Provider': 'The application the user wants. It authorizes access by verifying the token\'s signature, expiry, and audience — it never sees the password.'
};

const noteInfo = 'The SP verifies the token signature (was it really issued by the IdP?), the expiry (is it still valid?), and the audience (was it minted for this SP?). Only then does it extract claims and grant access.';

(function () {
  'use strict';
  const tooltip = document.getElementById('tooltip');

  function show(text, e) {
    tooltip.textContent = text;
    tooltip.classList.add('visible');
    position(e);
  }
  function hide() { tooltip.classList.remove('visible'); }
  function position(e) {
    const x = e.clientX + 16, y = e.clientY + 16;
    const r = tooltip.getBoundingClientRect();
    tooltip.style.left = Math.min(x, window.innerWidth - r.width - 16) + 'px';
    tooltip.style.top = Math.min(y, window.innerHeight - r.height - 16) + 'px';
  }
  function bind(el, text) {
    el.style.cursor = 'pointer';
    el.addEventListener('mouseenter', e => show(text, e));
    el.addEventListener('mousemove', position);
    el.addEventListener('mouseleave', hide);
  }

  function setup() {
    // Message labels carry the autonumber as a leading "N " — map by number.
    const msgs = document.querySelectorAll('.messageText');
    msgs.forEach(m => {
      const txt = (m.textContent || '').trim();
      const num = txt.match(/^(\d+)/);
      if (num && stepInfo[num[1]]) bind(m, stepInfo[num[1]]);
    });
    // Actor boxes (rect + label).
    document.querySelectorAll('text.actor, .actor > tspan, .actor').forEach(a => {
      const txt = (a.textContent || '').trim();
      if (actorInfo[txt]) bind(a, actorInfo[txt]);
    });
    // The verification note over the SP lane.
    document.querySelectorAll('.note, text.noteText, .noteText').forEach(n => {
      const txt = (n.textContent || '');
      if (txt.includes('Verify signature') || txt.includes('extract claims')) bind(n, noteInfo);
      if (txt.includes('IdP authenticates')) bind(n, 'IdP authenticates (proves who you are); SP authorizes (decides what you may do). They communicate only through the verifiable token.');
    });
  }

  function waitForMermaid() {
    const m = document.querySelector('.mermaid');
    if (m && m.querySelector('svg') && document.querySelectorAll('.messageText').length > 0) {
      setup();
    } else {
      setTimeout(waitForMermaid, 100);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(waitForMermaid, 120));
  } else {
    setTimeout(waitForMermaid, 120);
  }
})();
