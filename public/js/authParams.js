const _URL_PARAMS = new URLSearchParams(window.location.search);
const _QUERY_AUTH_TOKEN = _URL_PARAMS.get('auth');
const _QUERY_AUTH_ID = _URL_PARAMS.get('authId');
localStorage.setItem('authToken', _QUERY_AUTH_TOKEN);
localStorage.setItem('authId', _QUERY_AUTH_ID);
// 
$.ajaxSetup({
    headers: {
        'authToken': localStorage.getItem('authToken')
    }
});
// 