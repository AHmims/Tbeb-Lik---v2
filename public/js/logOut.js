if (document.getElementById('logout')) {
    document.getElementById('logout').addEventListener('click', () => {
        localStorage.removeItem('matricule');
        window.location.assign('/');
    });
}