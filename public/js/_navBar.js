if (document.getElementById('nb_menu_open') && document.getElementById('nb_menu_close')) {
    const btn_open = document.getElementById('nb_menu_open');
    const btn_close = document.getElementById('nb_menu_close');
    // 
    btn_open.addEventListener('click', _menu_toggle);
    btn_close.addEventListener('click', _menu_toggle);
    // 
    function _menu_toggle() {
        const menu = document.getElementById('nb_mobile');
        const visible = menu.getAttribute('data-visible') == 'false' ? false : true;
        // 
        menu.style.display = visible ? 'none' : 'block';
        // 
        menu.setAttribute('data-visible', !visible);
    }
}