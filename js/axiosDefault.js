axios.defaults.baseURL = 'http://localhost:3000';

const doGetData = async () => {
  return await axios({
    method: 'get',
    url: '/protect/teste'
  })
}

const doGet = async (route, params) => {
  await axios({
    method: 'get',
    url: route,
    data: {
      ...params
    }
  })
}

const doVerifyToken = async (tokens) => {
  return await axios({
    method: 'post',
    url: '/token',
    data: {
      ...tokens
    }
  })
}

async function doPost(route, params) {
  return await axios({
    method: 'post',
    url: route,
    data: { ...params }
  })
}

async function doRegistration(params) {
  return await axios({
    method: 'post',
    url: '/user/registration',
    data: { ...params }
  })
}

const doPut = async (route, params) => {
  return await axios({
    method: 'put',
    url: route,
    data: { ...params }
  })
}

const doDelete = async (route, params) => {
  return await axios({
    method: 'delete',
    url: route,
    data: {
      ...params
    }
  })
}