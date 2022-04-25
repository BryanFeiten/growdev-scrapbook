axios.defaults.baseURL = 'https://scrapbook-growdev-api.herokuapp.com';

const doGetData = async () => {
  return await axios({
    method: 'get',
    url: '/protect/h2!(A60s@H)@'
  })
}

const doGet = async (route) => {
  await axios({
    method: 'get',
    url: route
  })
}

async function doRegistration(params) {
  return await axios({
    method: 'post',
    url: '/user/registration',
    data: { ...params }
  })
}

async function doLogin(params) {
  return await axios({
    method: 'post',
    url: '/user/auth',
    data: { ...params }
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