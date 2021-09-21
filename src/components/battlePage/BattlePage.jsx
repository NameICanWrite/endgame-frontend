import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router';
import { io } from 'socket.io-client'
import { path } from '../../App';
import { getCookie, token } from './API'
import { fetchUserData } from '../userProfile/API';

import './style.sass'

function BattlePage() {
    let [battleData, setBattleData] = useState()
    const [userData, setUserData] = useState()

    const [yourIndex, setYourIndex] = useState()
    const [enemyIndex, setEnemyIndex] = useState()
    const [you, setYou] = useState()
    const [enemy, setEnemy] = useState()

    const [yourName, setYourName] = useState()
    const [enemyName, setEnemyName] = useState()
    const [yourHP, setYourHP] = useState()
    const [enemyHP, setEnemyHP] = useState()
    const [yourMove, setYourMove] = useState()
    const [enemyMove, setEnemyMove] = useState()

    const [fightTimer, setFightTimer] = useState()
    const [turn, setTurn] = useState()

    const [battleFinished, setBattleFinished] = useState(false)

    const history = useHistory()
    const socket = io(path, {
        // query: `token=${getCookie('jwt')}`,
        withCredentials: true
    });

    function move(card) {
        
        //set current move 
        battleData.users[yourIndex].currentMove = card

        //give new card, delete current
        battleData.users[yourIndex].cards = battleData.users[yourIndex].cards.map(currentCard => currentCard.name == card.name ? {name: undefined} : currentCard)

        //if both did move
        if (battleData.users[yourIndex].currentMove?.name && battleData.users[enemyIndex].currentMove?.name) {
            
            //no moves. time for animation
            battleData.users[yourIndex].canMove = false

            socket.emit('fight timer start', battleData)
        } else {
            //pass move to the enemy
            battleData.users[yourIndex].canMove = false
            battleData.users[enemyIndex].canMove = true
        }
        socket.emit('turn timer stop', battleData)

        setBattleData(battleData)
    }

    function handleKillEnemy() {
            battleData.users[enemyIndex].hp = 0
            setBattleData()
            socket.emit('update battle', battleData)
    }

    useEffect(() => {

        socket.on('finish battle', (data) => {
            console.log('finishing battle')
            setBattleData(data)
            setBattleFinished(true)
        })
    }, [])
    useEffect(() => {
        socket.emit('update battle', battleData)
    }, [])
    useEffect(async () => {
        await fetchUserData().then(res => {
            setUserData(res);
            socket.on('update battle', data => {
                console.log('updating battle...')
                const yourIndex = data.users?.findIndex(item => item._id == res._id)
                // console.log(yourIndex)
                // console.log(yourIndex && data.users[yourIndex].canMove == true && typeof data.users[yourIndex].turnTimer === 'undefined')
              if ((typeof yourIndex === 'number') && data.users[yourIndex].canMove == true && data.users[yourIndex].turnTimer === undefined) {
                  console.log('starting turn timer')
                    socket.emit('turn timer start', data, yourIndex)
                } 
                setBattleData(data)
            })
        }).catch(err => {
            history.push('/login')
        })
    }, [])

    useEffect(() => {
        setYourIndex(battleData?.users?.findIndex(item => item._id == userData._id))
        setEnemyIndex(Math.abs(battleData?.users?.findIndex(item => item._id == userData._id) - 1))

    }, [battleData, userData])

    useEffect(() => {
        if (battleData?.users) {
        setYou(battleData?.users[yourIndex])
        setEnemy(battleData?.users[enemyIndex])

        setYourName(battleData?.users[yourIndex]?.username || 'unknown')
        setEnemyName(battleData?.users[enemyIndex]?.username || 'unknown')

        setYourHP(battleData?.users[yourIndex]?.hp)
        setEnemyHP(battleData?.users[enemyIndex]?.hp)

        setYourMove(battleData?.users[yourIndex]?.currentMove?.name)
        setEnemyMove(battleData?.users[enemyIndex]?.currentMove?.name)

        setFightTimer(battleData?.fightTimer)
        setTurn(battleData?.users[yourIndex]?.canMove && 'your' || battleData?.users[enemyIndex]?.canMove && 'enemy')}
    }, [yourIndex, enemyIndex, battleData, userData])

    return (
        <div>
            {
                battleData && !battleFinished
                    ?
                    <div>

                        {/* Battle field */}

                        <h1>Your enemy is {enemyName}</h1>
                        <h2>Enemy hp: {enemyHP}</h2>
                        <p>Enemy timer: {enemy?.turnTimer}</p>
                        <br />
                        <p>Enemy move: {enemyMove}</p>
                        <p>{fightTimer || turn &&`It's ${turn} turn`}</p>
                        <p>Your move: {yourMove}</p>
                        <br />
                        <h1>You are {yourName}</h1>
                        <h2>Your hp: {yourHP}</h2>
                        <p>Your timer: {you?.turnTimer}</p>
                        <br />

                        <button onClick={handleKillEnemy}>Kill enemy</button>

                        {/* Deck */}

                        <div>
                            <span>Your cards</span>
                            <br />
                            <div>
                                {
                                    battleData?.users ?
                                    battleData?.users[yourIndex]?.cards.map(card => {
                                        return (
                                            <button onClick={() => {
                                                if (battleData.users[yourIndex].canMove && card.name) {
                                                    move(card)
                                                }
                                            }}>
                                                {card.name ? `${card.name} ${card.attack}💥 ${card.defence}🛡️` : `empty`}
                                            </button>
                                        )
                                    })
                                    : ''
                                }
                            </div>
                        </div>
                    </div>
                    :
                    <div>
                        <span>Waiting for a battle...</span>
                    </div>
                    
            }
            {
                battleFinished
                &&
                <div>
                    <h1>{battleData.winner} wins</h1>
                    <button onClick={() => history.push('/profile')}>Ok</button>
                </div>
            }
        </div>
    )
}

export default BattlePage
