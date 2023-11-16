import { CrossButton } from "../crossButton/crossButton"
import styles from "./mainBox.module.scss"
import { BackToGame } from "../backToGame/backToGame"

type MainBoxProps = {
	bgColor?: string,
	children: JSX.Element
	className?: string,
	displayGameRunning?: boolean,
}

const MainBox: React.FC<MainBoxProps> = ({
	bgColor,
	children,
	className,
	displayGameRunning = true,
}) =>
{
	return (
		<div className={styles.mainBox + " " + className}
			style={{ backgroundColor: bgColor }}>
			{displayGameRunning && <BackToGame />}
			<CrossButton className={styles.backButton}/>
			{children}
		</div>
	)
}

export default MainBox
