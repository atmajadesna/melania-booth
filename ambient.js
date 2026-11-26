document.addEventListener('DOMContentLoaded', () => {
  const heading = document.querySelector('.gallery-heading');
  const control = document.createElement('button');
  control.className = 'ambient-toggle';
  control.style.cssText = 'font-size:12px;border-radius:24px;min-height:44px;white-space:nowrap';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  function sync() {
    const paused = document.body.classList.contains('motion-paused') || reduced.matches;
    control.textContent = paused ? '▶' : 'Ⅱ';
    control.setAttribute('aria-label', paused ? 'Lanjutkan gerakan galeri' : 'Hentikan sementara gerakan galeri');
    control.setAttribute('aria-pressed', String(paused));
    control.disabled = reduced.matches;
  }
  control.onclick = () => { document.body.classList.toggle('motion-paused'); sync(); };
  reduced.addEventListener('change', sync);
  heading.append(control);
  sync();
});
