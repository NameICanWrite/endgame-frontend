import axios from 'axios';


export const fetchData = async () => {
    const response = await axios.get('http://localhost:5000/foo');
    return response.data
}

export const postData = async () => {
    const response = await axios.post('http://localhost:5000/foo');
    return response.data
}