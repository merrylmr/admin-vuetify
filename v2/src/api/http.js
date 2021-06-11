import axios from 'axios'

// axios.defaults.baseURL = '/api/v1'
import router from '../router/index.js'

axios.interceptors.request.use((config) => {
    return config
})

axios.interceptors.response.use((res) => {
    if (res.status !== 200) {
        return Promise.reject(res.data)
    }
    return res.data;
}, (error) => {
    const data = error.response.data;
    if (data.code === 401) {
        router.replace({
            name: 'login'
        })
    }
    return Promise.reject(error.response.data)
})

export default axios