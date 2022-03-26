document.addEventListener('DOMContentLoaded', checkLogin());

function getTokens() {
    const token = localStorage.getItem('token');
    const tempToken = localStorage.getItem('tempToken');
    return { tempToken, token };
}

function setTokens(token, tempToken) {
    localStorage.setItem('token', token);
    localStorage.setItem('tempToken', tempToken);
}

async function checkLogin() {
    const { token, tempToken } = getTokens();
    if (token && tempToken) {
        const { data, status } = await doVerifyToken({ token, tempToken })

        if (data.tempToken) {
            setTokens(localStorage.getItem('token'), data.tempToken);
            location = './posts.html'
        }

        if (status === 200) {
            alert('Usuário logado. Redirecionando para a página principal.');
            location = './posts.html'
        }
    }
}

async function getUsers() {
    const { data } = await doGetData();
    return data.users;
}

async function onClickLogIn(event) {
    event.preventDefault();

    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;


    const data = await doPost('/user/auth', { email, password });

    const { token, tempToken, mensagem } = data;

    if (token) {
        setTokens(token, tempToken);
        alert(mensagem);
        location = './posts.html'
    } else {
        alert("Usuário ou senha incorretos...");
    }
}