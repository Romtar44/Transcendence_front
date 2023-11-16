import styles from './popover.module.scss'
import { MagicBoxLayout } from '../../layout/magicBox.layout'

type PopoverProps = {
	w?: string,
	h?: string,
	children: JSX.Element,
	display: boolean,
	setDisplay: React.Dispatch<React.SetStateAction<boolean>>,
	crossDisplay?: boolean
}

export const MyPopover: React.FC<PopoverProps> = ({
	w = "350px",
	h = "450px",
	children,
	display,
	setDisplay,
	crossDisplay = true

}) =>
{
	document.addEventListener("keydown", (event) =>
	{
		if (event.key === "Escape")
			setDisplay(false)
	});

	return (
		<MagicBoxLayout className={styles.popoverContainer}
			w={w} style={{ display: display ? "flex" : "none" }}
			onClickCross={() => setDisplay(false)} crossDisplay={crossDisplay} >
			{children}
		</MagicBoxLayout >
	)
}
