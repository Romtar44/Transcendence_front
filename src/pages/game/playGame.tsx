import { useContext, useRef } from "react";
import { useEffect } from "react";
import MainBox from "../../component/mainBox/mainBox";
import variables from '../../global.scss'
import styles from './game.module.scss'
import themes from './themes.module.scss'
import { Paddle } from "../../component/game/paddle";
import { Ball } from "../../component/game/ball";
import { GameVarType, socketGame } from "./game";
import React from "react";
import { UserContext } from "../../lib/context";
import { FieldBackground } from "../../component/game/fieldBackground";
import { Button } from "../../component/button/button";

let leaveInterval: NodeJS.Timeout | null = null

type PlayGameProps = {
	gameState: GameVarType,
	gameIdRef: React.MutableRefObject<string>
	setGameState: React.Dispatch<React.SetStateAction<GameVarType | undefined>>,
	fieldRatioRef: React.MutableRefObject<number | undefined>,

}

export const PlayGame: React.FC<PlayGameProps> = ({
	gameState,
	gameIdRef,
	setGameState,
	fieldRatioRef
}) =>
{

	const mousePosRef = useRef<number>(0);
	const field = document.getElementById("gameField")
	const { user } = useContext(UserContext);


	let fieldTop = 0
	if (!fieldTop)
		fieldTop = field?.getBoundingClientRect().y || 0

	const emitMousePos = (event: MouseEvent) =>
	{
		if (!fieldRatioRef.current)
			return
		socketGame?.emit(`player${gameState.myStatus === "player1" ? 1 : 2}MovePaddle`, {
			gameId: gameIdRef.current,
			posY: mousePosRef.current * fieldRatioRef.current
		})

	}




	useEffect(() =>
	{
		if (leaveInterval !== null)
		{
			clearTimeout(leaveInterval)
			leaveInterval = null
		}

		return (() =>
		{
			leaveInterval = setTimeout(() => socketGame.disconnect(), 10000)
		})

	}, [])


	useEffect(() =>
	{
		if (gameState.myStatus !== 'spectator' && gameState.gameId)
		{
			var interval = setInterval(emitMousePos, 4);
		}

		return () =>
		{
			clearInterval(interval)
		}
		// eslint-disable-next-line
	}, [gameState.state, gameState.gameId])

	if (!user)
		return null

	return (
		<div style={{ width: '100%', height: "100%", display: "flex" }}>
			<MainBox bgColor={variables.mainbgcolor} displayGameRunning={false}>
				<div id="gameField" className={`${themes[`theme${user.theme}`]} ${styles.gameField}`} style={{ "--bgTheme": user?.themeColor } as React.CSSProperties} onMouseMove={(event) =>
				{
					if (gameState.myStatus === "spectator")
						return
					let mousePosY = event.clientY - fieldTop - (gameState.paddleHeight / 2)
					if (mousePosY < gameState.ball.diameter * 3)
						mousePosY = gameState.ball.diameter * 3
					if (field && mousePosY + (gameState.paddleHeight) > (field?.offsetHeight - (gameState.ball.diameter * 3)))
						mousePosY = field?.offsetHeight - (gameState.ball.diameter * 3) - (gameState.paddleHeight)

					mousePosRef.current = mousePosY
				}
				}>
					{fieldRatioRef.current &&
						<>
							<Paddle h={gameState.paddleHeight} w={gameState.paddleWidth} paddlePosY={gameState.player1?.paddlePosY} paddlePosX={gameState.player1?.paddlePosX} />
							<Ball diameter={gameState.ball.diameter} posX={gameState.ball.posX} posY={gameState.ball.posY} />
							<Paddle h={gameState.paddleHeight} w={gameState.paddleWidth} paddlePosY={gameState.player2?.paddlePosY} paddlePosX={gameState.player2?.paddlePosX} />

						</>
					}
					<FieldBackground scoreP1={gameState.player1?.points} scoreP2={gameState.player2?.points} />
					<div id="scoreDisplay"></div>
				</div>
			</MainBox>
			{
				gameState.myStatus !== "spectator" &&
				<Button className={styles.leaveGameButton} onClick={() => {
					socketGame.emit(`endGame`, {gameId: gameIdRef.current, player: gameState.myStatus})
				}}>
					<span>Abandonner</span>
				</Button>
			}
		</div>)
}


export const DisplayScore: React.FC<{ gameState: GameVarType, scorePlayer1: number, scorePlayer2: number, winner: "player1" | "player2" }> = ({ gameState, scorePlayer1, scorePlayer2, winner }) =>
{

	return (
		<div className={styles.score} >
		</div>
	)

}


