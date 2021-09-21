import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router';
import { io } from 'socket.io-client'
import { path } from '../../App';
import { getCookie, token } from './API'
import { fetchUserData } from '../userProfile/API';
import { cards } from './API';

import './style.sass'

function BattlePage() {
    let [battleData, setBattleData] = useState()
    const [userData, setUserData] = useState()

    const [yourIndex, setYourIndex] = useState()
    const [enemyIndex, setEnemyIndex] = useState()

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
        query: `token=${getCookie('jwt')}`
    });

    function move(cardIndex) {
        //set current move 
        battleData.users[yourIndex].currentMove = cardIndex

        //give new card, delete current
        battleData.users[yourIndex].cards = battleData.users[yourIndex].cards.map(currentCardIndex => currentCardIndex == cardIndex ? Math.floor(Math.random() * 19) : currentCardIndex)

        //if both did move
        if (!isNaN(battleData.users[yourIndex].currentMove) && !isNaN(battleData.users[enemyIndex].currentMove)) {
            
            //no moves. time for animation
            battleData.users[yourIndex].canMove = false

            socket.emit('fight timer start', battleData)
        } else {
            //pass move to the enemy
            battleData.users[yourIndex].canMove = false
            battleData.users[enemyIndex].canMove = true
        }
        socket.emit('update battle', battleData)

        setBattleData(battleData)
    }

    function handleKillEnemy() {
            battleData.users[enemyIndex].hp = 0
            setBattleData()
            socket.emit('update battle', battleData)
    }

    useEffect(() => {
        socket.emit('update battle', battleData)
        socket.on('update battle', data => {
            console.log('updating battle...')
            setBattleData(data)
        })
        socket.on('finish battle', (data) => {
            console.log('finishing battle')
            setBattleData(data)
            setBattleFinished(true)
        })
    }, [])
    useEffect(async () => {
        await fetchUserData().then(res => {
            setUserData(res);
        }).bcatch(err => {
            history.push('/login')
        })
    }, [])

    useEffect(() => {
        setYourIndex(battleData?.users.findIndex(item => item._id == userData._id))
        setEnemyIndex(Math.abs(battleData?.users.findIndex(item => item._id == userData._id) - 1))

    }, [battleData, userData])

    useEffect(() => {
        setYourName(battleData?.users[yourIndex]?.username || 'unknown')
        setEnemyName(battleData?.users[enemyIndex]?.username || 'unknown')

        setYourHP(battleData?.users[yourIndex]?.hp)
        setEnemyHP(battleData?.users[enemyIndex]?.hp)

        setYourMove(cards[battleData?.users[yourIndex]?.currentMove]?.name)
        setEnemyMove(cards[battleData?.users[enemyIndex]?.currentMove]?.name)

        setFightTimer(battleData?.fightTimer)
        setTurn(battleData?.users[yourIndex]?.canMove && 'your' || battleData?.users[enemyIndex]?.canMove && 'enemy')
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
                        <br />
                        <p>Enemy move: {enemyMove}</p>
                        <p>{fightTimer || turn &&`It's ${turn} turn`}</p>
                        <p>Your move: {yourMove}</p>
                        <br />
                        <h1>You are {yourName}</h1>
                        <h2>Your hp: {yourHP}</h2>
                        <br />

                        <button onClick={handleKillEnemy}>Kill enemy</button>

                        {/* Deck */}

                        <div>
                            <span>Your cards</span><br />
                            <div>
                                {
                                    battleData.users[yourIndex]?.cards.map(cardIndex => {
                                        const card = cards[cardIndex]
                                        return (
                                            <button onClick={() => {
                                                if (battleData.users[yourIndex].canMove) {
                                                    move(cardIndex)
                                                }
                                            }}>
                                                {`${card.name} ${card.attack}💥 ${card.defence}🛡️`}
                                            </button>
                                        )
                                    })
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
