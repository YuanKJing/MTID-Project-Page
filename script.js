const button = document.querySelector('#copy');
const bibtex = document.querySelector('#bib');

button?.addEventListener('click', async () => {
  const text = bibtex?.textContent || '';
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const area = document.createElement('textarea');
    area.value = text;
    document.body.appendChild(area);
    area.select();
    document.execCommand('copy');
    area.remove();
  }
  button.textContent = 'Copied ✓';
  window.setTimeout(() => { button.textContent = 'Copy BibTeX'; }, 1800);
});
