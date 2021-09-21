import React, { useEffect} from 'react'
import {useHistory } from 'react-router'
import { fetchUserData, postUserData } from './API'
import {logout} from '../loginForm/API'

function UserProfile() {

  const [userData, setUserData] = React.useState({})
  let [clicks, setClicks] = React.useState(0)

  const history = useHistory()


  useEffect(async () => {
    const res = await fetchUserData()
    setUserData(res);
    const newClicks = res.data?.clicks || 0
    setClicks(newClicks)
  }, []);

  return (
    <div>
      <h1>User {userData.username || 'undefined'}</h1>
      <p>{`${clicks} clicks`}</p>
      
      <button onClick={async () => {
        clicks++
        setClicks(clicks)
        postUserData({ clicks })
      }}>Click me!</button>

      <button onClick={async () => {
        const res = await logout().then((res) => {
          console.log(res)
          history.push('/login')
        })
        }} >logout</button>
    </div>
  )
}

export default UserProfile
