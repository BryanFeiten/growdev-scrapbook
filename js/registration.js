//* Verificar se a repetição de senha está de acordo com a senha
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

//* Criar usuário
async function onClickCreateUser(event) {
    event.preventDefault();

    const firstName = document.querySelector('#firstName').value;
    const lastName = document.querySelector('#lastName').value;
    const phone = document.querySelector('#phone').value;
    const gender = document.querySelector('#form-register').gender.value;
    const age = document.querySelector('#age').value;
    const email = document.querySelector('#createEmail').value;
    const password = document.querySelector('#createPassword').value;


    if (await userAlready(email)) {
        alert('Você já está cadastrado(a) em nossa plataforma! Faça seu login');
        location = './index.html';

        return
    }

    const { checkedInputs, message } = await checkInputs(firstName, lastName, phone, gender, age, email, password);

    if (checkedInputs) {
        try {
            const { status, mensagem } = await createNewUser(firstName, lastName, phone, gender, age, email, password);

            if (status === 201) {
                location = './index.html';
                alert(mensagem);
            } else {
                alert('Erro ao criar conta, tente novamente mais tarde');
            }    
        } catch (error) {
            alert('Erro ao criar conta, tente novamente mais tarde');
        }

        return
    }

    alert(message);
}

//* Verificar se o email já está cadastrado na plataforma
async function userAlready(email) {
    const users = await getUsers();

    return users.some(user => user.email === email);
}

//* Checar se os campos preenchidos para criar a conta são válidos
async function checkInputs(firstName, lastName, phone, gender, age, email, password) {
    let message = '';
    let checkedInputs = false;

    switch (true) {
        case firstName.length < 3:
            message = 'Seu primeiro nome deve conter pelo menos 3 letras.';
            break
        case lastName.length < 2:
            message = 'Seu último nome deve conter pelo menos 2 letras.';
            break
        case gender !== 'masculine' && gender !== 'femine' && gender !== 'non-binary':
            message = 'Por favor insira um gênero válido.';
            break
        case email.indexOf("@") === -1 || email.indexOf('.com') === -1:
            message = 'Por favor insira um e-mail válido.';
            break
        case email.indexOf('.com') - email.indexOf('@') - 1 <= 2:
            message = 'Por favor insira um e-mail válido.';
            break
        case age < 18:
            message = `Infelizmente pessoas menores de idade não podem ter conta na plataforma. retorne após ${(age - 18) * (-1)} ano(s).`;
            break
        case !phone:
            message = 'Por favor insira seu número de celular.';
            break
        case password.length < 5:
            message = 'Sua senha deve ter no mínimo 5 caracteres';
            break
        default:
            checkedInputs = true;
    }

    return { checkedInputs, message };
}

//* Criar usuário na API
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

    const mensagem = data.mensagem;

    return { status, mensagem };
}
