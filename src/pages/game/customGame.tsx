import React, { useContext, useState } from "react"
import { Button } from "../../component/button/button"
import { Slider } from "../../component/slider/slider"
import styles from './game.module.scss'
import variables from '../../global.scss'
import { MyPopover } from "../../component/popover/popover"
import { SearchFriend } from "../../component/searchFriend/searchFriend"
import { UserContext } from "../../lib/context"

export type GameOptionIndex = "ballSpeed" | "ballSize" | "ballAcceleration" |
	"paddleHeight" | "paddleWidth" | "pointLimit"

export type GameOption = Record<GameOptionIndex, number>

export const CustomGame: React.FC<{}> = () =>
{
	const [gameOption, setGameOption] = useState<GameOption>({
		paddleHeight: 40,
		paddleWidth: 10,
		ballSpeed: 2,
		ballSize: 4,
		ballAcceleration: 0.2,
		pointLimit: 10
	})

	const { friendList } = useContext(UserContext)
	const [displayInvite, setDisplayInvite] = useState(false)


	return (
		<div className={styles.customGame}>
			<div className={styles.checkBoxContainer}>
				<div className={styles.param}>
					<span>Vitesse de la balle</span>
					<Slider type="ballSpeed" id="2" min={1} max={5} step={1} inputValue={gameOption.ballSpeed} setInputValue={setGameOption} />
				</div>

				<div className={styles.param}>
					<span>Accélération de la balle</span>
					<Slider type="ballAcceleration" id="2" min={0} max={5} step={1} inputValue={gameOption.ballAcceleration} setInputValue={setGameOption} />
				</div>

				<div className={styles.param}>
					<span>Longueur de la raquette</span>
					<Slider type="paddleHeight" id="2" min={10} max={80} step={1} inputValue={gameOption.paddleHeight} setInputValue={setGameOption} />
				</div>

				<div className={styles.param}>
					<span>Nombre de point pour gagner</span>
					<Slider type="pointLimit" id="2" min={1} max={100} step={1} inputValue={gameOption.pointLimit} setInputValue={setGameOption} />
				</div>

			</div>
			<div className={styles.buttonCont}>
				<Button onClick={() => setDisplayInvite(true)} className={styles.buttonStyle} variant="squared" bgColor={variables.pinkcolor} color="white">
					<h2>Jouer avec un ami</h2>
				</Button>
			</div>
			{
				displayInvite &&
				<MyPopover setDisplay={setDisplayInvite} display={displayInvite}>
					<SearchFriend isGame={true} profils={friendList} gameVar={gameOption} />
				</MyPopover>
			}
		</div>)
}
