import React from "react"
import styles from "./checkBox.module.scss"

type CheckBoxProps = {
	id: string,
	setState: React.Dispatch<React.SetStateAction<boolean>>,
	state: boolean
	onChange: () => void
}

export const CheckBox: React.FC<CheckBoxProps> = ({
	id,
	state,
	onChange
}) =>
{
	const handleClick = () =>
	{
		onChange()
	}

	return (
		<div className={styles.checkBoxContainer}>
			<input onChange={handleClick} type="checkbox" className={styles.checkBox} id={id} checked={state} />
			<label className={styles.labelPos} htmlFor={id}></label>
		</div >
	)
}
