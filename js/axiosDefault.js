// axios.defaults.baseURL = 'https://scrapbook-growdev-api.herokuapp.com';
axios.defaults.baseURL = 'http://localhost:5000';

const doGetData = async () => {
  return await axios({
    method: 'get',
    url: '/protect/BrY4nF3l1p3Acc3ssThis4p1Ke1'
  }).then(response => {
    const { data } = response;
    return data;
  }).catch(error => {
    return error;
  });
}

const doGet = async (route, params) => {
  await axios({
    method: 'get',
    url: route,
    data: {
      ...params
    }
  }).then(response => {
    const { data } = response;
    return data;
  }).catch(error => {
    return error;
  });
}

const doVerifyToken = async (tokens) => {
  return await axios({
    method: 'post',
    url: '/token',
    data: {
      ...tokens
    }
  }).then(response => {
    return response;
  }).catch(error => {
    return error;
  });
}

async function doPost(route, params) {
  return await axios({
    method: 'post',
    url: route,
    data: { ...params }
  }).then(response => {
    const { data } = response;
    return data;
  }).catch(error => {
    return error;
  });
}

const doPut = async (route, params) => {
  return await axios({
    method: 'put',
    url: route,
    data: { ...params }
  }).then(response => {
    const { data } = response;
    return data
  }).catch(error => {
    return data
  });
}

const doDelete = async (route, params) => {
  return await axios({
    method: 'delete',
    url: route,
    data: {
      ...params
    }
  }).then(response => {
    return response
  }).catch(error => {
    console.log(error)
  });
}