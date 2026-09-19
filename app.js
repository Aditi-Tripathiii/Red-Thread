const views = [...document.querySelectorAll('.view')];
const navItems = [...document.querySelectorAll('[data-view]')];
const pageLabel = document.querySelector('#page-label');
const toast = document.querySelector('#toast');
let toastTimer;

const labels = { home: 'OVERVIEW', scan: 'SCAN CONTENT', alerts: 'ALERTS', audit: 'APP AUDIT', settings: 'SETTINGS' };
function showView(name) {
  const target = document.querySelector(`#view-${name}`) ? name : 'home';
  views.forEach(view => view.classList.toggle('active', view.id === `view-${target}`));
  document.querySelectorAll('.nav-item').forEach(item => item.classList.toggle('active', item.dataset.view === target));
  pageLabel.textContent = labels[target];
  history.replaceState(null, '', `#${target}`);
  document.querySelector('.sidebar')?.classList.remove('open');
}
function notify(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}
navItems.forEach(item => item.addEventListener('click', e => { e.preventDefault(); showView(item.dataset.view); }));
window.addEventListener('hashchange', () => showView(location.hash.slice(1) || 'home'));
showView(location.hash.slice(1) || 'home');

document.querySelector('.mobile-menu')?.addEventListener('click', () => document.querySelector('.sidebar').classList.toggle('open'));
document.querySelector('#monitor-toggle')?.addEventListener('change', e => notify(e.target.checked ? 'Notification monitoring resumed.' : 'Monitoring paused. No new content will be analysed.'));
document.querySelector('#settings-monitor')?.addEventListener('change', e => { const main = document.querySelector('#monitor-toggle'); if (main) main.checked = e.target.checked; notify(e.target.checked ? 'Monitoring enabled.' : 'Monitoring paused.'); });
document.querySelector('#cloud-toggle')?.addEventListener('change', e => notify(e.target.checked ? 'Cloud analysis enabled. Content is redacted first.' : 'Cloud analysis disabled. Local mode is active.'));

document.querySelectorAll('[data-action]').forEach(button => button.addEventListener('click', () => {
  const action = button.dataset.action;
  if (action === 'clear-scan') { const input = document.querySelector('#scan-input'); input.value = ''; input.dispatchEvent(new Event('input')); document.querySelector('#scan-result').innerHTML = '<div class="empty-result"><div class="scan-orb">⌕</div><h3>Your result will appear here</h3><p>We’ll look for urgency, impersonation, payment requests, suspicious links, and other scam signals.</p></div>'; }
  if (action === 'learn') notify('Safety guide opened — slow down, verify independently, and never share OTPs.');
  if (action === 'mark-reviewed') notify('All alerts marked as reviewed.');
  if (action === 'show-alert') document.querySelector('#modal').classList.add('open');
  if (action === 'close-modal') document.querySelector('#modal').classList.remove('open');
  if (action === 'run-audit') { notify('Audit complete — no critical findings.'); button.textContent = '✓ Audit complete'; setTimeout(() => button.textContent = '↻ Run audit', 2200); }
  if (action === 'secure-app') notify('Guidance ready: open the official app and review linked devices.');
  if (action === 'delete-history') { if (confirm('Delete all locally saved analysis history?')) notify('Local scan history deleted.'); }
}));
document.querySelector('#modal')?.addEventListener('click', e => { if (e.target.id === 'modal') e.currentTarget.classList.remove('open'); });

const input = document.querySelector('#scan-input');
const counter = document.querySelector('#char-count');
input?.addEventListener('input', () => counter.textContent = `${input.value.length.toLocaleString()} / 5,000`);
document.querySelectorAll('.scan-tab').forEach(tab => tab.addEventListener('click', () => { document.querySelectorAll('.scan-tab').forEach(t => t.classList.remove('active')); tab.classList.add('active'); input.placeholder = tab.dataset.scanType === 'url' ? 'Paste a URL such as https://example.com…' : 'Paste a suspicious message, email, or URL here…'; }));
document.querySelectorAll('[data-example]').forEach(button => button.addEventListener('click', () => { input.value = button.dataset.example === 'bank' ? 'URGENT: Your SBI account will be suspended today. Verify your PAN immediately at http://sbi-verify.example/login or your account will be closed. Share the OTP with our executive to complete verification.' : 'Your parcel could not be delivered. Pay ₹25 redelivery fee now: bit.ly/3xExample. Update your address within 30 minutes.'; input.dispatchEvent(new Event('input')); }));
document.querySelector('#analyze-button')?.addEventListener('click', () => {
  const value = input.value.trim();
  if (!value) { notify('Paste a message or URL first.'); input.focus(); return; }
  const isDelivery = /parcel|delivery|redelivery/i.test(value);
  const isRisk = /otp|urgent|suspend|payment|verify|account|click|fee|password|closed/i.test(value);
  const high = isRisk && !isDelivery;
  document.querySelector('#scan-result').innerHTML = `<div class="result-content"><div class="result-header"><div><p class="eyebrow">ANALYSIS COMPLETE · LOCAL</p><h2>${high ? 'High risk' : 'Needs caution'}</h2></div><span class="result-badge ${high ? 'high' : 'caution'}">${high ? 'HIGH RISK' : 'CAUTION'}</span></div><div class="result-category"><span>${high ? '⚠' : '↗'}</span><strong>${high ? 'Likely phishing' : 'Suspicious delivery request'}</strong><small>Confidence: ${high ? '91' : '78'}%</small></div><h4>Why this was flagged</h4><ul class="reason-list"><li>Uses urgency or time pressure</li><li>Requests payment or sensitive information</li><li>Contains a link that should be verified independently</li></ul><div class="recommendation"><strong>Recommended next step</strong><p>Do not click the link or share an OTP. Open the official app directly to verify this request.</p></div><p class="disclaimer">Automated analysis can be incorrect. Verify important requests independently.</p><button class="outline-button" data-action="delete-result">Delete this analysis</button></div>`;
  document.querySelector('[data-action="delete-result"]')?.addEventListener('click', () => { document.querySelector('#scan-result').innerHTML = '<div class="empty-result"><div class="scan-orb">⌕</div><h3>Result deleted</h3><p>This analysis was removed from the page.</p></div>'; });
  notify('Analysis complete — review the warning signs.');
});

document.addEventListener('keydown', e => { if (e.key === 'Escape') document.querySelector('#modal')?.classList.remove('open'); });
