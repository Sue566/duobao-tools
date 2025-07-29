const modules = window.tools;

function loadMenu() {
  const list = document.getElementById('menu');
  window.menu.forEach(cat => {
    const li = document.createElement('li');
    li.innerHTML = `<span class="cat">${cat.title}</span>`;
    const ul = document.createElement('ul');
    cat.children.forEach(child => {
      const item = document.createElement('li');
      item.innerHTML = `<a href="#tool-${child.tool}" data-tool="${child.tool}">${child.title}</a>`;
      ul.appendChild(item);
    });
    li.appendChild(ul);
    list.appendChild(li);
  });
  loadAllTools(window.menu);
}

function filterMenu(term) {
  document.querySelectorAll('#menu a').forEach(a => {
    const match = a.textContent.includes(term);
    a.parentElement.style.display = match ? 'list-item' : 'none';
  });
  document.querySelectorAll('#content section').forEach(sec => {
    const match = sec.dataset.title.includes(term);
    sec.style.display = match ? '' : 'none';
  });
}

function loadAllTools(menu) {
  const content = document.getElementById('content');
  content.innerHTML = '';
  menu.forEach(cat => {
    cat.children.forEach(child => {
      const section = document.createElement('section');
      section.id = `tool-${child.tool}`;
      section.dataset.title = child.title;
      content.appendChild(section);
      const module = modules[child.tool];
      if (module && module.render) {
        module.render(section);
      }
    });
  });
}

window.addEventListener('DOMContentLoaded', () => {
  loadMenu();
  document.getElementById('search').addEventListener('input', e => {
    filterMenu(e.target.value);
  });
});
