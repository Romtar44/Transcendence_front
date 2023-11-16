import React from "react";
import styles from "./barLevel.module.scss"

type BarLevelProps = {
	bgColor: string,
	progressionColor: string,
	h: string,
	w: string,
	percentage: string,
	title?: string,
	leftElem?: JSX.Element,
	rightElem?: JSX.Element,
	borderWidth?: string,
	className?: string
	placeHolder?: string
	placeHolder2?: string,
	placeHolderColor?: string,
	fs?: string

}

export const BarLevel: React.FC<BarLevelProps> = ({
	bgColor,
	progressionColor,
	h,
	w,
	title,
	percentage,
	leftElem,
	rightElem,
	borderWidth = "1px",
	className,
	placeHolder,
	placeHolder2,
	placeHolderColor,
	fs = "18px"
}) =>
{
	return (
		<div className={`${styles.barContainer} ${className}`} style={{
			width: w, height: h
		}}>
			{leftElem}
			<div className={styles.bar} style={{
				backgroundColor: bgColor, borderWidth,
				borderRadius: `calc(${h} * 0.5) / calc(${h} * 0.5)`,
				fontSize: fs
			}}>
				<div className={styles.progression} style={{
					"--progression": percentage, backgroundColor: progressionColor,
					borderRadius: `calc(${h} * 0.5) / calc(${h} * 0.5)`
				} as React.CSSProperties}>
				</div>
				<div className={styles.placeHolders}>
					<span className={styles.placeHolder} style={{ color: placeHolderColor }}>{placeHolder}</span>
					<span className={styles.placeHolder2} style={{ color: placeHolderColor }}>{placeHolder2}</span>
				</div>
			</div>
			{rightElem}

		</div>
	)
}
