//设置跟路径
axios.defaults.baseURL = "http://api-breakingnews-web.itheima.net";
//添加请求拦截
axios.interceptors.request.use(
  function (config) {
    if (config.url.indexOf("/my") !== -1) {
      config.headers.Authorization = localStorage.getItem("token");
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
//添加响应拦截器
axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);
