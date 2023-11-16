import React from 'react';
import styles from './gameComp.module.scss'

type paddleProps = {
	h: number,
	w: number;
	paddlePosY?: number,
	paddlePosX?: number,
	adversairePaddle?: boolean
}

export const Paddle: React.FC<paddleProps> = ({
	h,
	paddlePosY,
	paddlePosX,
	w,
}) =>
{

	return (
		<div>
			<div className={styles.paddle}
				style={{ height: h + "px", width: w + "px", top: paddlePosY + "px", left: paddlePosX + "px" }} />
		</div>)

}
