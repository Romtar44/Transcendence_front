import { useEffect, useState } from "react"
import { socketGame } from "../../pages/game/game"
import Image from "../image/image"
import styles from "./backToGame.module.scss"
import pongImage from '../../asset/pongimage.png'
import { useNavigate } from "react-router"

export const BackToGame = () =>
{
	const [gameRunning, setGameRunning] = useState(false)
	const navigate = useNavigate()
	useEffect(() =>
	{
		setGameRunning(socketGame.connected)

		// eslint-disable-next-line
	}, [socketGame.connected])

	return (
		gameRunning ?
			<div className={styles.backToGame} onClick={() =>
			{
				if ((socketGame.auth as any).gameId)
					navigate(`/game/${(socketGame.auth as any).gameId}`)
			}
			}
				title="Retour au match">
				<Image w="70px" className={styles.pongLogo} alt="pong logo" imgSrc={pongImage} />
				<div>
					<h2>Partie en cours</h2>
					<span>Regagnez vite le match avant d'être deconnecter</span>
				</div>
				<Image w="70px" className={styles.pongLogo} alt="pong logo" imgSrc={pongImage} />
			</div>
			:
			null)
}
