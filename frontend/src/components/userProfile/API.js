import axios from 'axios';

// const path = 'https://endgame-backend.herokuapp.com'
const path = 'http://localhost:5000'

export const fetchUserData = async () => {
    const response = await axios.get(path + '/users/user-data', {withCredentials: true});
    console.log(response.data)
    return response.data
}

export const postUserData = async (data) => {
    console.log(data)
    const response = await axios({
        method:  'POST',
        url: path + '/users/user-data',
        data,
        withCredentials: true
      });
    return response.data
}