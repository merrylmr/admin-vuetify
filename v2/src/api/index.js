import axios from "./http.js";

export const peopleInfo = (params) => {
    return axios.get('/peopleInfo', {params: params})
}
