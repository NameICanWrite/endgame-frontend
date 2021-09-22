import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router';
import { io } from 'socket.io-client'
import { path } from '../../App';
import { getCookie, token } from './API'
import { fetchUserData } from '../userProfile/API';

import './style.sass'
import Cards, { Card } from './Cards';

function BattlePage() {
    let [battleData, setBattleData] = useState()
    const [userData, setUserData] = useState()

    const [yourIndex, setYourIndex] = useState()
    const [enemyIndex, setEnemyIndex] = useState()
    const [you, setYou] = useState()
    const [enemy, setEnemy] = useState()

    const [yourName, setYourName] = useState()
    const [enemyName, setEnemyName] = useState()
    const [yourHP, setYourHP] = useState(20)
    const [enemyHP, setEnemyHP] = useState(20)
    const [yourTurnTimer, setYourTurnTimer] = useState(15)
    const [enemyTurnTimer, setEnemyTurnTimer] = useState(15)
    const [yourCards, setYourCards] = useState()
    const [enemyCards, setEnemyCards] = useState()
    const [yourMove, setYourMove] = useState({
        name: 'Clone 1',
        defence: 19,
        attack: 9
      })
    const [enemyMove, setEnemyMove] = useState({
        name: 'Clone 1',
        defence: 19,
        attack: 9
      })

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

        // delete current card
        battleData.users[yourIndex].cards = battleData.users[yourIndex].cards.map(currentCard => currentCard.name == card.name ? { name: undefined } : currentCard)


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

    function handleCard(card) {
        if (battleData.users[yourIndex].canMove && card.name) {
            move(card)
        }
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
            // battleData.users[yourIndex] && (battleData.users[yourIndex].turnTimer = 9)
            setYou(battleData?.users[yourIndex])
            setEnemy(battleData?.users[enemyIndex])

            setYourTurnTimer(battleData?.users[yourIndex]?.turnTimer || 15)
            setEnemyTurnTimer(battleData?.users[enemyIndex]?.turnTimer || 15)

            setYourName(battleData?.users[yourIndex]?.username || 'unknown')
            setEnemyName(battleData?.users[enemyIndex]?.username || 'unknown')

            setYourHP(battleData?.users[yourIndex]?.hp)
            setEnemyHP(battleData?.users[enemyIndex]?.hp)

            setYourCards(battleData?.users[enemyIndex]?.cards)
            setEnemyCards(battleData?.users[enemyIndex]?.cards)

            setYourMove(battleData?.users[yourIndex]?.currentMove)
            setEnemyMove(battleData?.users[enemyIndex]?.currentMove)

            setFightTimer(battleData?.fightTimer)
            setTurn(battleData?.users[yourIndex]?.canMove && 'your' || battleData?.users[enemyIndex]?.canMove && 'enemy')
        }
    }, [yourIndex, enemyIndex, battleData, userData])

    return (
        <div className='battle-page'>
            {
                battleData && !battleFinished
                    ?
                    <div className='battle-container'>

                        {/* Battle field */}


                        {/* Enemy player */}

                        <div className="enemy-info">
                            <div className='name'>{enemyName}</div>
                            <div className='timer'>
                                <span>Time left:</span>
                                <div className="progress-bar" style={{ background: `linear-gradient(to right, blue ${100 * (enemyTurnTimer) / 15}%, transparent ${100 - 100 * (enemyTurnTimer) / 15}%)` }}>
                                </div>
                            </div>
                            <div className='hp'>
                                <span>Health:</span>
                                <div className="progress-bar" style={{ background: `linear-gradient(to right, red ${100 * (enemyHP) / 20}%, transparent ${100 - 100 * (enemyHP) / 20}%)` }}>
                                </div>
                            </div>
                        </div>

                        <div className='enemy-cards'>
                            <Cards cards={battleData?.users[enemyIndex]?.cards} handleCard={() => {}}/>
                        </div>


                        {/* Display moves */}

                        <div className='referee'>{fightTimer || turn && `It's ${turn} turn` || 'Loading...'}</div>

                        <div className="moves">
                            <div className='move-container'>
                                {enemyMove && <Card card={enemyMove}/>}
                            </div>
                            
                            <div className='move-container'>
                                {yourMove && <Card card={yourMove}/>}
                            </div>
                        </div>


                        {/* Your player */}

                        <div className='your-cards'>
                            <Cards cards={battleData?.users[yourIndex]?.cards} handleCard={handleCard}/>
                        </div>

                        <div className="your-info">
                            <div className='name'>{yourName}</div>
                            <div className='timer'>
                                <span>Time left:</span>
                                <div className="progress-bar" style={{ background: `linear-gradient(to right, blue ${100 * (yourTurnTimer) / 15}%, transparent ${100 - 100 * (yourTurnTimer) / 15}%)` }}>
                                </div>
                            </div>
                            <div className='hp'>
                                <span>Health:</span>
                                <div className="progress-bar" style={{ background: `linear-gradient(to right, red ${100 * (yourHP) / 20}%, transparent ${100 - 100 * (yourHP) / 20}%)` }}>
                                </div>
                            </div>
                        </div>

                        <button onClick={handleKillEnemy} className='kill-enemy'>Kill enemy</button>
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