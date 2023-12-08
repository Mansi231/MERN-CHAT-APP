import axios from "axios";
const baseUrl = 'http://192.168.1.18:8000/api'

export const client = axios.create({
    baseURL:baseUrl,
    headers:{
        'Accept':'application/json',
        'Content-Type':'multipart/form-data',
        'Authorization': {
            toString() {
                let user = JSON.parse(localStorage.getItem('userInfo'))
                return `Bearer ${user?.token}`
            }
        }
}});
