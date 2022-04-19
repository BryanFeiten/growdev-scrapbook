document.addEventListener('DOMContentLoaded', () => {
    checkLogin();
    refreshPosts();
});

function getToken() {
    const token = localStorage.getItem('token');
    return token;
}

function setTokens(token) {
    localStorage.setItem('token', token);
}

async function checkLogin() {
    const token = getToken();

    if (token) {
        try {
            await doVerifyToken({ token })

        } catch (error) {
            alert('Faça seu login.');
            location = './index.html'
        }
    } else {
        alert('Faça seu login.');
        location = './index.html'
    }
}

async function getUsers() {
    const { data } = await doGetData();

    return data.users;
}

async function getPosts() {
    const token = getToken();
    const { data } = await doPost('/posts', { token });

    return data.showThisPosts;
}

async function getMyId() {
    const token = getToken();
    const { data } = await doPost('/myId', { token });

    return data.id;
}

async function onClickLogOut(event) {
    event.preventDefault();
    const token = getToken();
    await doPost('/user/logout', { token });

    localStorage.clear();
    location = './index.html';
}

async function saveCRUD(event) {
    event.preventDefault();

    const postHeader = document.querySelector('#descriptionCRUD');
    const postContent = document.querySelector('#textCRUD');
    const postPrivacity = document.querySelector('#formCRUD').privacityMessage;

    checkMessage(postHeader, postContent, postPrivacity);
}

async function checkMessage(postHeader, postContent, postPrivacity) {
    let validPost = false;
    let message = '';

    switch (true) {
        case postHeader.value.length < 3:
            message = 'Você precisa preencher o campo de Cabeçalho. O Cabeçalho deve ter 3 letras no mínimo.';
            break

        case postContent.value.length < 4:
            message = 'Você precisa preencher o campo de conteúdo. O Conteúdo deve ter 4 letras no mínimo.';
            break

        case postPrivacity.value !== 'private' && postPrivacity.value !== 'public':
            message = 'Por favor, escolha a privacidade do seu post.';
            break

        default:
            validPost = true;
    }

    if (validPost) {
        const token = getToken();
        const { data } = await doPost('/post/create', {
            token,
            postHeader: postHeader.value,
            postContent: postContent.value,
            postPrivacity: postPrivacity.value
        });

        postHeader.value = '';
        postContent.value = '';
        refreshPosts();
        return
    }

    alert(message);
}

async function refreshPosts() {
    const posts = await getPosts();
    const myId = await getMyId();
    const contentCRUD = document.querySelector('#contentCRUD');
    contentCRUD.innerHTML = '';
    let count = 1;

    if (posts.length > 0) {
        posts.map(message => {
            if (myId === message.userId) {
                contentCRUD.innerHTML += `
            <tr data-id="${message.id}">
                <td class="col-1 h6 bg-primary text-white border-rounded target" data-placement="right">${count}- ${message.userFirstName} ${message.userLastName}</td>
                <td class="col-3">${message.postHeader}</td>
                <td class="col-5">${message.postContent}</td>
                <td class="col-1">${message.postPrivacity}</td>
                <td class="col-2 text-center">
                    <a class="btn btn-danger p-1" href="#" onclick="removeMessage(event)" id="btnDelete">Apagar</a>
                    <a class="btn btn-success p-1" data-bs-toggle="modal" data-bs-target="#editMessage" href="#" onclick="addIdForEditList(event)" id="btnEdit">Editar</a>
                </td>
            </tr>`
                count++;
            } else {
                contentCRUD.innerHTML += `
                <tr data-id="${message.id}">
                <td class="col-1 h6 bg-secondary text-white border-rounded target" data-placement="right">${count}- ${message.userFirstName} ${message.userLastName}</td>
                <td class="col-3">${message.postHeader}</td>
                <td class="col-5">${message.postContent}</td>
                <td class="col-1">${message.postPrivacity}</td>
                    <td class="col-2 text-center text-min">Mensagem de outro usuário</td>
                </tr>`
                count++;
            }
        });
    }
}

async function removeMessage(event) {
    const token = getToken();
    const postId = event.target.parentNode.parentNode.getAttribute('data-id');

    await doDelete(`/post/delete/${postId}`, { token });

    refreshPosts();
}

async function editMessage(event) {
    const postId = document.querySelector('#editMessageId').getAttribute('data-id');
    const changePostHeader = document.querySelector('#editDescriptionCRUD');
    const changePostContent = document.querySelector('#editTextCRUD');
    const changePostPrivacity = document.querySelector("#editFormCRUD").editPrivacityMessage;

    let validPost = false;
    let message = '';

    switch (true) {
        case changePostHeader.value.length < 3:
            message = 'Você precisa preencher o campo de Cabeçalho. O Cabeçalho deve ter 3 letras no mínimo.';
            break

        case changePostContent.value.length < 4:
            message = 'Você precisa preencher o campo de conteúdo. O Conteúdo deve ter 4 letras no mínimo.';
            break

        case changePostPrivacity.value !== 'private' && changePostPrivacity.value !== 'public':
            message = 'Por favor, escolha a privacidade do seu post.';
            break

        default:
            validPost = true;
    }

    if (validPost) {
        const token = getToken();
        await doPut(`/post/modify/${postId}`, {
            token,
            newPostHeader: changePostHeader.value,
            newPostContent: changePostContent.value,
            newPostPrivacity: changePostPrivacity.value
        });

        changePostHeader.value = '';
        changePostContent.value = '';
        refreshPosts();

        return
    }

    alert(message);
}

async function addIdForEditList(event) {
    const postId = event.target.parentNode.parentNode.getAttribute('data-id');
    const token = getToken();
    const { data } = await doPost(`/post/search/${postId}`, { token });

    const { post } = data;

    const spanMessageId = document.querySelector('#editMessageId');
    spanMessageId.setAttribute('data-id', postId);

    spanMessageId.innerHTML = `(${post.id})`;
    const changePostHeader = document.querySelector('#editDescriptionCRUD');
    const changePostContent = document.querySelector('#editTextCRUD');
    const changePostPrivacity = document.querySelector("#editFormCRUD").editPrivacityMessage;

    changePostPrivacity.value = post.postPrivacity;
    changePostHeader.value = post.postHeader;
    changePostContent.value = post.postContent;
}