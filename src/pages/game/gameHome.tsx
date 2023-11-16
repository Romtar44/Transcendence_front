import { useState } from "react"
import styles from './game.module.scss'
import MainBox from "../../component/mainBox/mainBox"
import variables from '../../global.scss'
import { Button } from "../../component/button/button"
import { BackButton } from "../../component/crossButton/crossButton"
import { WatchGame } from "./watchGame"
import { StartGame } from "./startGame"
import { CustomGame } from "./customGame"

export type Mode = "standar" | "custom" | "watch" | undefined


export const GameHome = () =>
{
	const [mode, setMode] = useState<Mode>(undefined)


	const handleClick = (buttonMode: Mode) =>
	{
		setMode(buttonMode)
	}



	return (
		<MainBox bgColor={variables.mainbgcolor}>
			<div className={styles.pageContainer}>
				{
					mode === undefined &&
					<div className={styles.gameHomeContainer}>
						<Button onClick={() => handleClick("standar")} className={styles.buttonStyle} variant="squared" bgColor={variables.pinkcolor} color="white">
							<h2>Partie standard</h2>
						</Button>
						<Button onClick={() => handleClick("custom")} className={styles.buttonStyle} variant="squared" bgColor={variables.pinkcolor} color="white">
							<h2>Partie personnalisée</h2>
						</Button>
						<Button onClick={() => handleClick("watch")} className={styles.buttonStyle} variant="squared" bgColor={variables.pinkcolor} color="white">
							<h2>Regarder un match</h2>
						</Button>
					</div>
				}
				{
					mode !== undefined &&
					<BackButton className={""} setDisplay={setMode} />
				}
				{
					mode === "standar" &&
					<StartGame setMode={setMode} />
				}
				{
					mode === "custom" &&
					<CustomGame />

				}
				{
					mode === "watch" &&
					<WatchGame />
				}
			</div>
		</MainBox>
	)





}
