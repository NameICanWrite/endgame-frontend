import axios from 'axios';
import { path } from '../../App';
// const path = 'https://endgame-backend.herokuapp.com'

export const fetchUserData = async () => {
    const response = await axios.get(path + '/users/user-data', {withCredentials: true});
    console.log(response.data)
    return response.data
}

export const postUserData = async (data) => {
    const response = await axios.post(path + '/users/user-data', data, {withCredentials: true})
    .catch(err => {
      throw new Error(err.response.data)
    })
    return response.data
}