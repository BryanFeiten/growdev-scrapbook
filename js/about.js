document.addEventListener('DOMContentLoaded', () => {
    checkLogin();
    refreshPosts();
});

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
        try {
            const { data, status } = await doVerifyToken({ token, tempToken })

            if (data.tempToken) {
                setTokens(localStorage.getItem('token'), data.tempToken);
            }
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
    if (data.tempToken) {
        setTokens(localStorage.getItem('token'), data.tempToken);
    }
    return data.users;
}

async function getPosts() {
    const { token, tempToken } = getTokens();
    const data = await doPost('/posts', { token, tempToken });

    if (data.tempToken) {
        setTokens(localStorage.getItem('token'), data.tempToken);
    }
    return data.showThisPosts;
}

async function getMyId() {
    const { token, tempToken } = getTokens();
    const data = await doPost('/myId', { token, tempToken });

    if (data.tempToken) {
        setTokens(localStorage.getItem('token'), data.tempToken);
    }

    return data.id;
}

async function onClickLogOut(event) {
    event.preventDefault();
    localStorage.clear();
    location = './index.html'
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
        const { token, tempToken } = getTokens();
        const data = await doPost('/post/create', {
            token,
            tempToken,
            postHeader: postHeader.value,
            postContent: postContent.value,
            postPrivacity: postPrivacity.value
        });

        if (data.tempToken) {
            setTokens(localStorage.getItem('token'), data.tempToken);
        }

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
                <td class="col-1 h6 bg-primary text-white border-rounded target" data-placement="right">${count}- ${message.userFirstName} ${message.userLastName}</td>
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
    const { token, tempToken } = getTokens();
    const postId = event.target.parentNode.parentNode.getAttribute('data-id');

    const { data, status } = await doDelete(`/post/delete/${postId}`, { token, tempToken });

    if (status === 200) {
        if (data.tempToken) {
            setTokens(localStorage.getItem('token'), data.tempToken);
        }
    }

    refreshPosts();
}

async function editMessage(event) {
    const { token, tempToken } = getTokens();
    
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

        case changePostPrivacity.value !== 'private' && changePostPrivacity !== 'public':
            message = 'Por favor, escolha a privacidade do seu post.';
            break

        default:
            validPost = true;
    }

    if (validPost) {
        const { token, tempToken } = getTokens();
        const data = await doPut(`/post/modify/${postId}`, {
            token,
            tempToken,
            newPostHeader: changePostHeader.value,
            newPostContent: changePostContent.value,
            newPostPrivacity: changePostPrivacity.value
        });

        if (data.tempToken) {
            setTokens(localStorage.getItem('token'), data.tempToken);
        }

        changePostHeader.value = '';
        changePostContent.value = '';
        refreshPosts();
        
        return
    }

    alert(message);

    //     if (data.tempToken) {
    //         setTokens(localStorage.getItem('token'), data.tempToken);
    //     }

    //     refreshPosts();
    // } else {
    //     alert('Necessário mais de 4 caractéres');
    // }
}

async function addIdForEditList(event) {
    const postId = event.target.parentNode.parentNode.getAttribute('data-id');
    const { token, tempToken } = getTokens();
    const data = await doPost(`/post/search/${postId}`, { token, tempToken });

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