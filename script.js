const header = document.querySelector('#site-header');
const navToggle = document.querySelector('#nav-toggle');
const navLinks = document.querySelector('#nav-links');
const copyButton = document.querySelector('#copy-bibtex');
const copyStatus = document.querySelector('#copy-status');
const bibtex = document.querySelector('#bibtex');
const year = document.querySelector('#year');
const mobileQuery = window.matchMedia('(max-width: 760px)');
const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

const setMenuOpen = (isOpen) => {
  navToggle?.setAttribute('aria-expanded', String(isOpen));
  navLinks?.classList.toggle('is-open', isOpen);
  document.body.classList.toggle('nav-open', isOpen && mobileQuery.matches);
};

navToggle?.addEventListener('click', () => {
  const isOpen = navToggle.getAttribute('aria-expanded') !== 'true';
  setMenuOpen(isOpen);
  if (isOpen) {
    navLinks?.querySelector('a')?.focus();
  }
});

navLinks?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setMenuOpen(false));
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && navToggle?.getAttribute('aria-expanded') === 'true') {
    setMenuOpen(false);
    navToggle?.focus();
  }
});

mobileQuery.addEventListener('change', (event) => {
  if (!event.matches) {
    setMenuOpen(false);
  }
});

const updateHeader = () => {
  header?.classList.toggle('is-scrolled', window.scrollY > 12);
};

updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

const fallbackCopy = (text) => {
  const area = document.createElement('textarea');
  area.value = text;
  area.setAttribute('readonly', '');
  area.style.position = 'fixed';
  area.style.opacity = '0';
  document.body.appendChild(area);
  let copied = false;

  try {
    area.select();
    copied = document.execCommand('copy');
  } catch {
    copied = false;
  } finally {
    area.remove();
    copyButton?.focus();
  }

  return copied;
};

copyButton?.addEventListener('click', async () => {
  const text = bibtex?.textContent?.trim() || '';
  let copied = false;

  try {
    await navigator.clipboard.writeText(text);
    copied = true;
  } catch {
    copied = fallbackCopy(text);
  }

  const originalLabel = copyButton.textContent;
  copyButton.textContent = copied ? 'Copied' : 'Select text';

  if (copyStatus) {
    copyStatus.textContent = copied
      ? 'BibTeX copied to clipboard.'
      : 'Automatic copy was unavailable. Select the BibTeX manually.';
  }

  window.setTimeout(() => {
    copyButton.textContent = originalLabel;
  }, 1800);
});

if (year) {
  year.textContent = String(new Date().getFullYear());
}

const revealElements = [...document.querySelectorAll('[data-reveal]')];

if (!reducedMotionQuery.matches && 'IntersectionObserver' in window) {
  revealElements.forEach((element) => element.classList.add('will-reveal'));

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    {
      rootMargin: '0px 0px -8% 0px',
      threshold: 0.08,
    },
  );

  revealElements.forEach((element) => revealObserver.observe(element));
}
