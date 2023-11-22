document.addEventListener('DOMContentLoaded', function () {
    const menuIcon = document.getElementById('menuIcon');
    const navLinks = document.getElementById('navLinks');

    menuIcon.addEventListener('click', function () {
        navLinks.classList.toggle('show');
    });

    navLinks.addEventListener('click', function () {
        navLinks.classList.remove('show');
    });
});
