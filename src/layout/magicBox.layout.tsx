import { Button } from '../component/button/button'
import styles from './magicBox.layout.module.scss'
import { CloseIcon } from '@chakra-ui/icons'
import variables from "../global.scss"

type LayoutProps = {
	children: JSX.Element,
	className?: string,
	title?: string
	crossDisplay?: boolean,
	style?: Record<string, string>
	w?: string,
	onClickCross?: React.Dispatch<React.SetStateAction<boolean>>
}

export const MagicBoxLayout = ({
	children,
	crossDisplay = true,
	className,
	style,
	w = "550px",
	onClickCross
}: LayoutProps) =>
{
	const handlecrossClick = () =>
	{
		if (onClickCross)
			onClickCross(false)
		else
			window.history.back()
	}

	return (
		<div className={styles.container + " " + className} style={style}>
			<div className={styles.magicbox} style={{ width: w }}>
				{
					crossDisplay &&
					<Button onClick={() => handlecrossClick()} className={styles.cross} bgColor={variables.grenatcolor} border='1px solid white'>
						<CloseIcon color={'white'} margin={'auto'} />
					</Button>
				}
				<div className={styles.menu}>
					{children}
				</div>
			</div>
		</div>
	)
}
