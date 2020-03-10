import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import router from '@/router'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000, // request timeout
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = 'Bearer ' + getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => response,
  error => {
    // console.log('响应错误->', error, error.response) // for debug
    if(error.response.status === 401){
      // Message.error(error.response.data.message || '请重新登录');
      // store.dispatch('LogOut');
      // router.push({ path: '/login' });
      store.dispatch('user/resetToken')
      router.push({ path: '/login' })
    }else{
      //console.log(error.response.data)
      if(error.response.data.message) {
        Message.error(error.response.data.message);
      }
    }
    return Promise.reject(error);
  }
)

export default service
