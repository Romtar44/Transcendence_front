import { useNavigate } from "react-router"
import { Button } from "../button/button"
import styles from './crossButton.module.scss'
import Image from '../image/image'
import backLogo from '../../asset/back.svg'
import { Mode } from "../../pages/game/gameHome"

type BackButtonProps = {
	className: string,
	setDisplay: React.Dispatch<React.SetStateAction<Mode>>,
}

export const BackButton: React.FC<BackButtonProps> = ({
	className,
	setDisplay
}) =>
{
	return (
		<Button className={styles.crossButton + " " + className}
			color='white' bgColor='transparent' border='1px solid white'
			variant='rounded' onClick={() => setDisplay(undefined)}>
			<Image imgSrc={backLogo} alt='retour' w='70%' h="70%" />
		</Button>
	)
}

export const CrossButton: React.FC<{ className: string }> = ({ className }) =>
{
	const navig = useNavigate()

	return (
		<Button className={styles.crossButton + " " + className}
			color='white' bgColor='transparent' border='1px solid white'
			variant='rounded' onClick={() => navig("/")}>
			<Image imgSrc={backLogo} alt='retour' w='70%' h="70%" />
		</Button>
	)
}

