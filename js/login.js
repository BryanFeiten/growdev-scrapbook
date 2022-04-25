//* Fazer login
document.querySelector('#form-login').addEventListener('submit', (e) => {
    e.preventDefault();
    onClickLogIn();
})
async function onClickLogIn() {
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;

    const { validFields, message } = checkFields(email, password);

    if (!validFields) {
        alert(message);
        return
    }

    try {
        const { data } = await doLogin({ email, password });

        const { token, mensagem } = data;

        if (token) {
            setToken(token);
            alert(mensagem);
            location = './about.html'
        } else {
            alert("Usuário ou senha incorretos...");
        }
    } catch (error) {
        alert("Usuário ou senha incorretos...");
    }
}

//* Verificar se os campos email e password foram preenchidos corretamente
function checkFields(email, password) {
    let message = '';
    let validFields = false;

    switch (true) {
        case email.indexOf("@") === -1 || email.indexOf('.com') === -1:
            message = 'Por favor insira um e-mail válido.';
            break
        case email.indexOf('.com') - email.indexOf('@') - 1 <= 2:
            message = 'Por favor insira um e-mail válido.';
            break
        case password.length < 5:
            message = 'Sua senha deve ter no mínimo 5 caracteres';
            break
        default:
            validFields = true;
    }

    return { validFields, message };
}

//* Guardar token de login no localStorage
function setToken(token) {
    localStorage.setItem('token', token);
}