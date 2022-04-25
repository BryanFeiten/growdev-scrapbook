//* Checar se o usuário já está logado
document.addEventListener('DOMContentLoaded', () => {
    checkLogin();

    const token = getToken();

    if(token) {
        checkLogin(token);
        return
    }
});

//* Buscar e retornar token que estiver no local storage
function getToken() {
    const token = localStorage.getItem('token');
    return token;
}

//* Checar se o usuário está logado
async function checkLogin(token) {
    if (token) {
        try {
            const { status } = await doVerifyToken('/token', { token })

            if (status === 200) {
                alert('Usuário logado. Redirecionando para a página principal.');
                location = './about.html'
            } 
        } catch (error) {
            localStorage.clear();
        }
    } 
}

//* Buscar dados para checagem
async function getUsers() {
    const { data } = await doGetData();
    return data.users;
}