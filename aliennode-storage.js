/* Project storage boundary. Legacy default data stays in its original keys. */
(function (root) {
  'use strict';
  const project = new URLSearchParams(root.location.search).get('project') || 'default';
  function key(legacyKey) {
    return project === 'default' ? legacyKey : `aliennode:${encodeURIComponent(project)}:${legacyKey}`;
  }
  root.AlienNodeStorage = Object.freeze({
    project,
    key,
    getItem: name => root.localStorage.getItem(key(name)),
    setItem: (name, value) => root.localStorage.setItem(key(name), value),
    removeItem: name => root.localStorage.removeItem(key(name)),
  });
  root.document.addEventListener('DOMContentLoaded', () => {
    const brand = root.document.querySelector('.brand');
    if (brand) {
      const home = root.document.createElement('a');
      home.href = `AlienNode.html?project=${encodeURIComponent(project)}`;
      home.textContent = `AlienNode · ${project}`;
      home.style.color = 'inherit';
      brand.replaceChildren(home);
    }
    root.document.title = `AlienNode · ${project} — ${root.document.title.replace(/^AlienNode\s*[—·]\s*/, '')}`;
  });
})(window);
