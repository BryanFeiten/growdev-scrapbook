document.addEventListener('DOMContentLoaded', checkLogin());

function getToken() {
    const token = localStorage.getItem('token');
    return token;
}

async function checkLogin() {
    const token = getToken();
    if (token) {
        try {
            const { status } = await doVerifyToken('/token', { token })

            if (status === 200) {
                alert('Usuário logado. Redirecionando para a página principal.');
                location = './posts.html'
            } 
        } catch (error) {
            localStorage.clear();
        }
    } 
}

async function getUsers() {
    const { data } = await doGetData();
    return data.users;
}