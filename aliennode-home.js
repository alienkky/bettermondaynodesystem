(function () {
  'use strict';
  const field = document.getElementById('project');
  field.value = new URLSearchParams(location.search).get('project') || 'default';
  function update() {
    const project = field.value.trim() || 'default';
    document.querySelectorAll('[data-canvas]').forEach(link => {
      link.href = `${link.dataset.canvas}?project=${encodeURIComponent(project)}`;
    });
    document.getElementById('active-project').textContent = `현재 프로젝트: ${project}`;
  }
  field.addEventListener('input', update);
  document.getElementById('project-form').addEventListener('submit', event => {
    event.preventDefault();
    update();
    location.href = document.querySelector('[data-canvas]').href;
  });
  update();
})();
