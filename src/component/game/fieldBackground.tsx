import React from "react";
import styles from './gameComp.module.scss'

export const FieldBackground: React.FC<{ scoreP1?: number, scoreP2?: number }> = ({ scoreP1, scoreP2 }) =>
{
	return (
		<div className={styles.fieldBgCont}>
			<i className={styles.bgScore1}>{scoreP1}</i>
			<div className={styles.midLine} />
			<div className={styles.test}></div>
			<i className={styles.bgScore2}>{scoreP2}</i>
		</div>)
}
