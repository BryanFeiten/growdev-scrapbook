//* Checar se o usuário está logado e caso esteja, chamar o carregamento dos posts
document.addEventListener('DOMContentLoaded', () => {
    const token = getToken();

    if(token) {
        checkToken(token);
        refreshPosts();
        return
    }

    alert('Faça seu login.');
    location = './index.html'
});


//* Buscar e retornar token que estiver no localStorage
function getToken() {
    const token = localStorage.getItem('token');

    return token;
}

//* Checar se o token é válido
async function checkToken(token) {
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

//* Buscar e retornar posts que o usuário tem acesso
async function getPosts() {
    const token = getToken();
    const { data } = await doPost('/posts', { token });

    const { id, showThisPosts } = data;

    return { posts: showThisPosts, id };
}

//* Fazer o logout do usuário, tanto local, quanto na API via token
document.querySelector('#youReallyLogOut').addEventListener('submit', (e) => {
    e.preventDefault();
    onClickLogOut();
})
async function onClickLogOut() {
    const token = getToken();
    await doPost('/user/logout', { token });

    localStorage.clear();
    location = './index.html';
}

//* Adicionar post
document.querySelector('#addToDo').addEventListener('submit', (e) => {
    e.preventDefault();
    saveCRUD();
})
async function saveCRUD() {
    const postHeader = document.querySelector('#descriptionCRUD');
    const postContent = document.querySelector('#textCRUD');
    const postPrivacity = document.querySelector('#formCRUD').privacityMessage;

    const { validPost, message } = checkMessage(postHeader, postContent, postPrivacity);

    if (validPost) {
        const token = getToken();
        const { status } = await doPost('/post/create', {
            token,
            postHeader: postHeader.value,
            postContent: postContent.value,
            postPrivacity: postPrivacity.value
        });
        
        if (status === 201) {
            alert('Post adicionado com sucesso!');

            postHeader.value = '';
            postContent.value = '';
            refreshPosts();
        } else {
            alert('Erro ao adicionar post');
        }
       
        return
    }

    alert(message);
}

//* checar validade do post
function checkMessage(postHeader, postContent, postPrivacity) {
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

    return { validPost, message };
}

//* Recarregar posts após alguma alteração
async function refreshPosts() {
    const { posts, id } = await getPosts();
    const contentCRUD = document.querySelector('#contentCRUD');
    contentCRUD.innerHTML = '';
    let count = 1;

    if (posts.length > 0) {
        posts.map(message => {
            if (id === message.userId) {
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

//* Povoar modal de edição
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

//* Editar mensagem
document.querySelector('#editMessage').addEventListener('submit', (e) => {
    editMessage();
})
async function editMessage() {
    const postId = document.querySelector('#editMessageId').getAttribute('data-id');
    const changePostHeader = document.querySelector('#editDescriptionCRUD');
    const changePostContent = document.querySelector('#editTextCRUD');
    const changePostPrivacity = document.querySelector("#editFormCRUD").editPrivacityMessage;

    const { validPost, message } = checkMessage(changePostHeader, changePostContent, changePostPrivacity);

    if (validPost) {
        const token = getToken();
        const { status } = await doPut(`/post/modify/${postId}`, {
            token,
            newPostHeader: changePostHeader.value,
            newPostContent: changePostContent.value,
            newPostPrivacity: changePostPrivacity.value
        });

        if (status === 200) {
            alert('Post editado com sucesso!');

            changePostHeader.value = '';
            changePostContent.value = '';
            refreshPosts();
        } else {
            alert('Erro ao editar post');
        }
       
        return
    }

    alert(message);
}

//* Remover post
async function removeMessage(event) {
    const token = getToken();
    const postId = event.target.parentNode.parentNode.getAttribute('data-id');

    await doDelete(`/post/delete/${postId}`, { token });

    refreshPosts();
}