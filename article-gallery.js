const viewer = document.getElementById('image-viewer');
if (viewer && typeof viewer.showModal === 'function') {
  const preview = viewer.querySelector('img');
  const caption = viewer.querySelector('p');
  let trigger;
  document.querySelectorAll('[data-enlarge]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      trigger = link;
      preview.src = link.href;
      preview.alt = link.querySelector('img').alt;
      caption.textContent = preview.alt;
      viewer.showModal();
    });
  });
  viewer.querySelector('button').addEventListener('click', () => viewer.close());
  viewer.addEventListener('click', event => { if (event.target === viewer) viewer.close(); });
  viewer.addEventListener('close', () => { if (trigger) trigger.focus(); });
}
