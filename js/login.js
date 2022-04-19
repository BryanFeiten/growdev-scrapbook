function setTokens(token) {
    localStorage.setItem('token', token);
}

async function onClickLogIn(event) {
    event.preventDefault();

    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;

    const { data } = await doPost('/user/auth', { email, password });

    const { token, mensagem } = data;

    if (token) {
        setTokens(token);
        alert(mensagem);
        location = './posts.html'
    } else {
        alert("Usuário ou senha incorretos...");
    }
}