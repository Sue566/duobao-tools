async function loadMenu() {
  const res = await fetch('menu.json');
  const menu = await res.json();
  const list = document.getElementById('menu');
  menu.forEach(cat => {
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
  await loadAllTools(menu);
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


async function loadAllTools(menu) {
  const content = document.getElementById('content');
  content.innerHTML = '';
  for (const cat of menu) {
    for (const child of cat.children) {
      const section = document.createElement('section');
      section.id = `tool-${child.tool}`;
      section.dataset.title = child.title;
      content.appendChild(section);
      const module = await import(`./tools/${child.tool}.js`);
      module.render(section);
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  loadMenu().then(() => {
    document.querySelectorAll('#menu').forEach(node => {
      node.addEventListener('click', e => {
        const link = e.target.closest('a[data-tool]');
        if (link) {
          // allow default anchor behavior to jump to section
        }
      });
    });
  });

  document.getElementById('search').addEventListener('input', e => {
    filterMenu(e.target.value);
  });
});
