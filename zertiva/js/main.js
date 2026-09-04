document.getElementById('year').textContent = new Date().getFullYear();

const toggle = document.getElementById('menu-toggle');
const menu = document.getElementById('mobile-menu');
toggle.addEventListener('click', () => {
  const isOpen = menu.classList.toggle('open');
  toggle.setAttribute('aria-expanded', isOpen);
});
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  menu.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
}));
