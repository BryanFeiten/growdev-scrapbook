function onRepeatPassword() {
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

    const firstName = document.querySelector('#firstName').value;
    const lastName = document.querySelector('#lastName').value;
    const phone = document.querySelector('#phone').value;
    const gender = document.querySelector('#form-register').gender.value;
    const age = document.querySelector('#age').value;
    const email = document.querySelector('#createEmail').value;
    const password = document.querySelector('#createPassword').value;

    if (users.some(user => user.email === email)) {
        alert('Você já está cadastrado(a) em nossa plataforma! Faça seu login');
        location = './index.html';
        return
    }

    const { checkedInputs, mensagem } = await checkInputs(firstName, lastName, phone, gender, age, email, password);

    if (checkedInputs) {
        await createNewUser(firstName, lastName, phone, gender, age, email, password);
        location = './index.html';
        return
    }

    alert(mensagem);
}

async function checkInputs(firstName, lastName, phone, gender, age, email, password) {
    let mensagem = '';
    let checkedInputs = false;

    switch (true) {
        case firstName.length < 3:
            mensagem = 'Seu primeiro nome deve conter pelo menos 3 letras.';
            break
        case lastName.length < 2:
            mensagem = 'Seu último nome deve conter pelo menos 2 letras.';
            break
        case gender !== 'masculine' && gender !== 'femine' && gender !== 'non-binary':
            mensagem = 'Por favor insira um gênero válido.';
            break
        case email.indexOf("@") === -1 || email.indexOf('.com') === -1:
            mensagem = 'Por favor insira um e-mail válido.';
            break
        case email.indexOf('.com') - email.indexOf('@') - 1 <= 2:
            mensagem = 'Por favor insira um e-mail válido.';
            break
        case age < 18:
            mensagem = `Infelizmente pessoas menores de idade não podem ter conta na plataforma. retorne após ${(age - 18) * (-1)} ano(s).`;
            break
        case !phone:
            mensagem = 'Por favor insira seu número de celular.';
            break
        default:
            checkedInputs = true;
    }

    return { checkedInputs, mensagem };
}

async function createNewUser(firstName, lastName, phone, gender, age, email, password) {

    const { data, status } = await doRegistration({
        firstName,
        lastName,
        gender,
        email,
        phone,
        age,
        password
    });
    if (status === 201) {
        alert(data.mensagem);
        return
    }

    alert("Erro ao realizar cadastro. Tente novamente mais tarde!");
}
