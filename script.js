const header = document.querySelector('#site-header');
const navToggle = document.querySelector('#nav-toggle');
const navLinks = document.querySelector('#nav-links');
const copyButton = document.querySelector('#copy-bibtex');
const copyStatus = document.querySelector('#copy-status');
const bibtex = document.querySelector('#bibtex');
const year = document.querySelector('#year');
const mobileQuery = window.matchMedia('(max-width: 760px)');

const setMenuOpen = (isOpen) => {
  navToggle?.setAttribute('aria-expanded', String(isOpen));
  navToggle?.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  navLinks?.classList.toggle('is-open', isOpen);
  document.body.classList.toggle('nav-open', isOpen && mobileQuery.matches);
};

setMenuOpen(false);

navToggle?.addEventListener('click', () => {
  const isOpen = navToggle.getAttribute('aria-expanded') !== 'true';
  setMenuOpen(isOpen);

  if (isOpen) {
    window.requestAnimationFrame(() => navLinks?.querySelector('a')?.focus());
  }
});

const sectionLinks = [...(navLinks?.querySelectorAll('a[href^="#"]') || [])];

const setCurrentSection = (sectionId) => {
  sectionLinks.forEach((link) => {
    if (link.hash === `#${sectionId}`) {
      link.setAttribute('aria-current', 'location');
    } else {
      link.removeAttribute('aria-current');
    }
  });
};

sectionLinks.forEach((link) => {
  link.addEventListener('click', () => {
    setCurrentSection(link.hash.slice(1));
    setMenuOpen(false);
  });
});

navLinks?.querySelectorAll('a:not([href^="#"])').forEach((link) => {
  link.addEventListener('click', () => setMenuOpen(false));
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && navToggle?.getAttribute('aria-expanded') === 'true') {
    setMenuOpen(false);
    navToggle.focus();
  }
});

document.addEventListener('pointerdown', (event) => {
  if (
    mobileQuery.matches &&
    navToggle?.getAttribute('aria-expanded') === 'true' &&
    !header?.contains(event.target)
  ) {
    setMenuOpen(false);
  }
});

document.addEventListener('focusin', (event) => {
  if (
    mobileQuery.matches &&
    navToggle?.getAttribute('aria-expanded') === 'true' &&
    !header?.contains(event.target)
  ) {
    setMenuOpen(false);
  }
});

const handleViewportChange = (event) => {
  if (!event.matches) setMenuOpen(false);
};

if (mobileQuery.addEventListener) {
  mobileQuery.addEventListener('change', handleViewportChange);
} else {
  mobileQuery.addListener(handleViewportChange);
}

const updateHeader = () => {
  header?.classList.toggle('is-scrolled', window.scrollY > 12);
};

let scrollFramePending = false;
window.addEventListener(
  'scroll',
  () => {
    if (scrollFramePending) return;
    scrollFramePending = true;
    window.requestAnimationFrame(() => {
      updateHeader();
      scrollFramePending = false;
    });
  },
  { passive: true },
);
updateHeader();

const trackedSections = sectionLinks
  .map((link) => document.querySelector(link.hash))
  .filter(Boolean);

if ('IntersectionObserver' in window && trackedSections.length) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visibleEntry = entries.find((entry) => entry.isIntersecting);
      if (visibleEntry) setCurrentSection(visibleEntry.target.id);
    },
    { rootMargin: '-18% 0px -68% 0px', threshold: 0 },
  );

  trackedSections.forEach((section) => sectionObserver.observe(section));
}

const fallbackCopy = (text) => {
  const area = document.createElement('textarea');
  area.value = text;
  area.setAttribute('readonly', '');
  area.style.position = 'fixed';
  area.style.opacity = '0';
  document.body.appendChild(area);
  let copied = false;

  try {
    area.focus();
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

let copyResetTimer;
const copyDefaultLabel = 'Copy';

copyButton?.addEventListener('click', async () => {
  const text = bibtex?.textContent?.trim() || '';
  let copied = false;

  try {
    await navigator.clipboard.writeText(text);
    copied = true;
  } catch {
    copied = fallbackCopy(text);
  }

  window.clearTimeout(copyResetTimer);
  copyButton.textContent = copied ? 'Copied' : 'Select text';

  if (copyStatus) {
    copyStatus.textContent = copied
      ? 'BibTeX copied to clipboard.'
      : 'Automatic copy was unavailable. Select the BibTeX manually.';
  }

  copyResetTimer = window.setTimeout(() => {
    copyButton.textContent = copyDefaultLabel;
  }, 1800);
});

if (year) {
  year.textContent = String(new Date().getFullYear());
}
