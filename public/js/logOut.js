if (document.getElementById('logout')) {
    document.getElementById('logout').addEventListener('click', () => {
        localStorage.removeItem('authId');
        localStorage.removeItem('authToken');
        window.location.assign('/login');
    });
}