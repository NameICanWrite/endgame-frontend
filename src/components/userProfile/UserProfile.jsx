import React, { useEffect } from 'react'
import { useHistory } from 'react-router'

import { fetchUserData, postUserData } from './API'
import { logout } from '../loginForm/API'
import { startBattle } from '../battlePage/API'

function UserProfile() {

  const [userData, setUserData] = React.useState({})
  let [clicks, setClicks] = React.useState(0)

  const history = useHistory()


  useEffect(async () => {
    const res = await fetchUserData().then(res => {
      setUserData(res);
      const newClicks = res.data?.clicks || 0
      setClicks(newClicks)
    }).catch(err => {
        history.push('/login')
      })
  }, []);

  return (
    <div>
      <h1>User {userData.username || 'undefined'}</h1>
      <p>{`${clicks} clicks`}</p>

      <button onClick={async () => {
        clicks++
        setClicks(clicks)
        postUserData({ clicks }).then((res) => console.log(res)).catch((err) => console.log(err))
      }}>Click me!</button>

      <button onClick={async () => {
        const res = await logout().then((res) => {
          console.log(res)
          history.push('/login')
        })
      }} >logout</button>
      <br />
      <br />
      <button style={{ color: 'red' }}
        onClick={async () => {
          const res = await startBattle()
            .then((res) => {
              console.log(res)
              history.push('/battle')
            }).catch((err) => console.log(err))
        }}
      >TO BATTLE</button>
      <br />
      <br />
      <h4>Wins: {userData?.data?.wins || 0}</h4>
    </div>
  )
}

export default UserProfile
