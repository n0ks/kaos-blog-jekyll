const menuToggle = document.querySelector('.menu-toggle')
const header = document.querySelector('.header')

menuToggle.addEventListener('click', () => {
	menuToggle.classList.toggle('header-open')
	header.classList.toggle('is-open')
})
