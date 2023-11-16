import styles from './resultHandler.module.scss'
import { Button } from '../button/button'
import variables from './../../global.scss'
import Image from '../image/image'
import info from '../../asset/info.svg'

type ResultHandlerProps = {
	successStatus: boolean,
	resultMessage: string
}

export const ResultHandler: React.FC<ResultHandlerProps> = ({
	resultMessage,
	successStatus,

}) =>
{
	let color: string = variables.greencolor

	if (!successStatus)
	{
		color = variables.redcolor
	}

	return (
		<div className={styles.popupContainer}>
			<Button mouseOver="Light" color='white' bgColor={color} borderRadius='50px' border='1px solid white'
				disabled={true} >
				<div className={styles.popupElement}>
					<Image imgSrc={info} alt='Info' w='25px' />
					<span>
						{
							successStatus ?
								`Succès : ${resultMessage}`
								:
								`Erreur : ${resultMessage}`
						}
					</span>
				</div>
			</Button>
		</div>
	)
}
