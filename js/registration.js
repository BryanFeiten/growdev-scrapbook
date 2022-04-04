async function getUsers() {
    const data = await doGetData()
    return data.users;
}

function onRepeatPassword(event) {
    const password = document.querySelector('#createPassword');
    const repeatPassword = event.target;
    const btnCreateUser = document.querySelector('#btnCreateUser');
    if (password.value === repeatPassword.value) {
        btnCreateUser.disabled = false;
    } else if (password.value !== repeatPassword.value) {
        btnCreateUser.disabled = true;
    }
}

async function onClickCreateUser(event) {
    event.preventDefault();
    const users = await getUsers();

    let found = false;
    const firstName = document.querySelector('#firstName').value;
    const lastName = document.querySelector('#lastName').value;
    const phone = document.querySelector('#phone').value;
    const gender = document.querySelector('#form-register').gender.value;
    const age = document.querySelector('#age').value;
    const email = document.querySelector('#createEmail').value;
    const password = document.querySelector('#createPassword').value;
    const repeatPassword = document.querySelector('#repeatPassword').value;

    const userAlready = users.filter(user => user.email === email);

    if (userAlready?.length) {
        alert('Já existe um usuário com o mesmo nome! Escolha outro.');
        return
    }

    if (password !== repeatPassword) {
        alert('Sua confirmação de senha está diferente da original');
        return
    }
    found = checkInputs(firstName, lastName, phone, gender, age, email, password, repeatPassword);

    if (found) {
        return
    }

    alert("Usuário criado com sucesso!");
    location = './index.html'
}

async function checkInputs(firstName, lastName, phone, gender, age, email, password, repeatPassword) {
    let mensagem = '';
    let error = false;

    switch (true) {
        case firstName.length < 3:
            mensagem = 'Seu primeiro nome deve conter pelo menos 3 letras.';
            error = true;
            break
        case lastName.length < 2:
            mensagem = 'Seu último nome deve conter pelo menos 2 letras.';
            error = true;
            break
        case gender !== 'masculine' && gender !== 'femine' && gender !== 'non-binary':
            mensagem = 'Por favor insira um gênero válido.';
            error = true;
            break
        case email.indexOf("@") === -1 || email.indexOf('.com') === -1:
            mensagem = 'Por favor insira um e-mail válido.';
            error = true;
            break
        case age < 18:
            mensagem = `Infelizmente pessoas menores de idade não podem ter conta na plataforma. retorne após ${(age - 18) * (-1)} ano(s).`;
            error = true;
            break
        case !phone:
            mensagem = 'Por favor insira seu número de celular.';
            error = true;
            break
    }

    if (!error) {
        await createNewUser(firstName, lastName, phone, gender, age, email, password, repeatPassword);
        location = './index.html'
        return
    }

    alert(mensagem);
    return
}

async function createNewUser(firstName, lastName, phone, gender, age, email, password) {

    const response = await doRegistration({
        firstName,
        lastName,
        gender,
        email,
        phone,
        age,
        password
    });

    const { data, status } = response;

    if (status === 201) {
        alert(data.mensagem);
    } else {
        alert("Erro ao realizar cadastro. Tente novamente mais tarde!");
    }

    return;
}
