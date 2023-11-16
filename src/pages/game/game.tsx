import Cookies from "js-cookie";
import { useContext, useRef } from "react";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Debounce, sendWrapper } from "../../lib/utils";
import { Loader } from "../../component/loader/loader";
import { DisplayScore, PlayGame } from "./playGame";
import { UserContext } from "../../lib/context";
import { useNavigate } from "react-router-dom";
import { Match } from "../../lib/types/user.type";
import { createRoot, Root } from "react-dom/client";
import { ResultGame } from "./resultGame";
import { Button } from "../../component/button/button";

export let displayScoreRoot: Root | null = null

export let socketGame = io(
	{});

export type GameVarType = {

	gameId: string,
	myStatus: "spectator" | "player1" | "player2",
	state: "pending" | "in progress" | "finished",


	ball: {
		posX: number,
		posY: number,
		diameter: number
	},


	paddleHeight: number,
	paddleWidth: number,
	player1?: {
		id: string,
		paddlePosX?: number,
		paddlePosY?: number,
		username: string,
		points?: number
	},

	player2?: {
		id: string,
		paddlePosX?: number,
		paddlePosY?: number,
		username: string,
		points?: number
	}
}



export const Game = () =>
{


	const gameId = window.location.pathname.split("/game/")[1]

	let field = document.getElementById("gameField")

	const [gameState, setGameState] = useState<GameVarType | undefined>(() => undefined)

	const [finishedGame, setFinishedGame] = useState<Match | undefined>(undefined)





	const gameIdRef = useRef<string>("");

	const fieldRatioRef = useRef<number | undefined>(undefined)
	const { user, updateUser } = useContext(UserContext);

	const navigate = useNavigate()


	const connectGame = () =>
	{

		const gameId = window.location.pathname.split("/game/")[1]
		socketGame = io(`${process.env.REACT_APP_BACK_URL}/game` || "",
			{
				auth: {
					access_token: Cookies.get('access_token'),
					gameId: gameId,
					profilId: user?.profil.id
				}
			});
	}

	const getVarWithRatio = (gameVar: any, prevRatio?: number) =>
	{
		if (!fieldRatioRef.current)
			return gameVar
		let ratio = fieldRatioRef.current
		if (prevRatio)
			ratio = fieldRatioRef.current / prevRatio
		return {
			ball: {
				posX: gameVar.ball.posX / ratio,
				posY: gameVar.ball.posY / ratio,
				diameter: gameVar.ball.diameter / ratio,

			},
			paddleHeight: gameVar.paddleHeight / ratio,
			paddleWidth: gameVar.paddleWidth / ratio,
			player1: {
				id: gameVar.player1.id,
				paddlePosX: gameVar.player1.paddlePosX / ratio,
				paddlePosY: gameVar.player1.paddlePosY / ratio,
				points: gameVar.player1.points
			},

			player2: {
				id: gameVar.player2.id,
				paddlePosX: gameVar.player2.paddlePosX / ratio,
				paddlePosY: gameVar.player2.paddlePosY / ratio,
				points: gameVar.player2.points
			},
		}
	}




	const handleSetGameState = (res: any) =>
	{

		const state = res.data.userGameState

		if (res.data.status === "game in progress" || (res.data.status === "pending"))
		{
			connectGame()

			let myStatus: "spectator" | "player1" | "player2" = "spectator"
			if (state.player1?.id === user?.profil.id)
				myStatus = 'player1'
			else if (state.player2?.id === user?.profil.id)
				myStatus = 'player2'

			setGameState({ ...state, ...getVarWithRatio(state), myStatus: myStatus })
			socketGame?.on(`${gameId}`, (gameVar: any) =>
			{
				const gameVarRatio = getVarWithRatio(gameVar)
				setGameState((prev) => ({ ...prev, ...gameVar, ...gameVarRatio }))
			})

			socketGame?.on(`${gameId}score`, async (data: { player1Score: number, player2Score: number, winner: "player1" | "player2" }) =>
			{
				setGameState((prev) => (prev ? {
					...prev,
					player1: prev.player1 ? { ...prev.player1, points: data.player1Score } : undefined,
					player2: prev.player2 ? { ...prev.player2, points: data.player2Score } : undefined
				} : undefined))
				displayScoreRoot?.render(<DisplayScore gameState={state} scorePlayer1={data.player1Score} scorePlayer2={data.player2Score} winner={data.winner} />)
				await new Promise(f => setTimeout(f, 5000))
				displayScoreRoot?.render(<div id='scoreDisplay' />)

			})

			socketGame?.on(`end${gameId}`, (data: Match) =>
			{
				socketGame.disconnect()
				if (gameState?.myStatus !== "spectator")
					updateUser()
				setFinishedGame(data)
			})

			if (myStatus !== "spectator")
			{
				socketGame.emit('ready', { gameId, player: myStatus })
			}
		}
		else
			setFinishedGame(state)

	}

	const handleError = (error: any) =>
	{
		if (error.response.status === 404)
			navigate('/')
	}


	const getFieldRatio = () =>
	{
		const newField = document.getElementById("gameField")
		if (newField)
			fieldRatioRef.current = 300 / newField.offsetWidth
	}

	useEffect(() =>
	{
		const prevFieldEmpty = !fieldRatioRef.current ? true : false
		getFieldRatio()
		if (prevFieldEmpty)
			setGameState((prev) => (prev ? { ...prev, ...getVarWithRatio(prev) } : undefined))
	}, [field])


	useEffect(() =>
	{
		if (!user || finishedGame || gameState)
			return
		sendWrapper('get', `/game/getPlayingGame/${gameId}`, handleSetGameState, handleError)

		// eslint-disable-next-line
	}, [user])



	useEffect(() =>
	{
		const debounce = new Debounce()

		window.addEventListener('resize', () =>
		{
			debounce.execute(() =>
			{
				const prevRatio = fieldRatioRef.current
				getFieldRatio()
				setGameState((prev) => (prev ? { ...prev, ...getVarWithRatio(prev, prevRatio) } : undefined))
			}, 300)
		})
		return () =>
		{
			window.removeEventListener('resize', () =>
			{
				debounce.execute(() =>
				{
					getFieldRatio()
					setGameState((prev) => (prev ? { ...prev, ...getVarWithRatio(prev) } : undefined))

				}, 300)
			});
		};

	}, [])




	useEffect(() =>
	{
		if (gameState?.gameId)
			gameIdRef.current = gameState.gameId
	}, [gameState?.gameId])


	useEffect(() =>
	{
		const displayScoreDiv = document.getElementById("scoreDisplay")
		if (displayScoreDiv)
			displayScoreRoot = createRoot(displayScoreDiv)
	}, [gameState?.state])



	if (finishedGame)
		return <ResultGame match={finishedGame} />


	if (!gameState)
		return <Loader />


	if (gameState.state === "in progress")
	{
		return (
			<PlayGame setGameState={setGameState} gameState={gameState} gameIdRef={gameIdRef} fieldRatioRef={fieldRatioRef} />)
	}

	return null
}


