import axios from 'axios';
<<<<<<< HEAD
import { path } from '../../App';
// const path = 'https://endgame-backend.herokuapp.com'
=======

// const path = 'https://endgame-backend.herokuapp.com'
const path = 'http://localhost:5000'
>>>>>>> 5f19d49cdd19084929351ba97c1fd300a159caeb

export const fetchUserData = async () => {
    const response = await axios.get(path + '/users/user-data', {withCredentials: true});
    console.log(response.data)
    return response.data
}

export const postUserData = async (data) => {
<<<<<<< HEAD
    const response = await axios.post(path + '/users/user-data', data, {withCredentials: true})
    .catch(err => {
      throw new Error(err.response.data)
    })
=======
    console.log(data)
    const response = await axios({
        method:  'POST',
        url: path + '/users/user-data',
        data,
        withCredentials: true
      });
>>>>>>> 5f19d49cdd19084929351ba97c1fd300a159caeb
    return response.data
}