import React from 'react';
import styles from './gameComp.module.scss'

type BallProps = {
	posX: number
	posY: number;
	diameter: number
}
export const Ball: React.FC<BallProps> = ({ posX, posY, diameter }) =>
{
	return (<>
		<div key={`${posY}${posX}`} className={styles.ball}
			style={{
				height: diameter * 2, width: diameter * 2,
				top: posY - diameter, left: posX - diameter
			}} >
		</div>
	</>)
}

