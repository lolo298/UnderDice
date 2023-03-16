import './style.css'


const menu = document.querySelector('.menu');
const btn = document.createElement('button');
btn.textContent = 'Click me';
if(menu) {
menu.appendChild(btn);
}
