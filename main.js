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
      item.innerHTML = `<a href="#" data-tool="${child.tool}">${child.title}</a>`;
      ul.appendChild(item);
    });
    li.appendChild(ul);
    list.appendChild(li);
  });
}

function filterMenu(term) {
  document.querySelectorAll('#menu a').forEach(a => {
    const match = a.textContent.includes(term);
    a.parentElement.style.display = match ? 'list-item' : 'none';
  });
}

async function loadTool(tool) {
  const module = await import(`./tools/${tool}.js`);
  module.render(document.getElementById('content'));
}

window.addEventListener('DOMContentLoaded', () => {
  loadMenu().then(() => {
    document.querySelectorAll('#menu').forEach(node => {
      node.addEventListener('click', e => {
        const link = e.target.closest('a[data-tool]');
        if (link) {
          e.preventDefault();
          loadTool(link.dataset.tool);
        }
      });
    });
  });

  document.getElementById('search').addEventListener('input', e => {
    filterMenu(e.target.value);
  });
});
