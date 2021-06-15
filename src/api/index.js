import axios from "./http.js";

export const peopleInfo = (params) => {
    return axios.get('/peopleInfo', {params: params})
}

// 获取位置信息
export const posInfo = (params) => {
    return axios.get('/posInfo', {params: params})
}
