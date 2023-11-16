import MainBox from "../../component/mainBox/mainBox"
import { MatchBox } from "../../component/matchBox/matchBox"
import variables from '../../global.scss'
import { Match } from "../../lib/types/user.type"
import styles from './game.module.scss'
import themes from './themes.module.scss'
import React, { useContext } from "react";
import { UserContext } from "../../lib/context";

export const ResultGame: React.FC<{ match: Match }> = ({ match }) =>
{

	const { user } = useContext(UserContext);

	let winnerUsername = match.p1Score > match.p2Score ? match.players[0].userName : match.players[1].userName
	if (match.gaveUp)
	{
		winnerUsername = match.gaveUp === "player1" ? match.players[1].userName : match.players[0].userName

	}
	const loserUsername = match.gaveUp === "player1" ? match.players[0].userName : match.players[1].userName


	if (!user)
		return null
		
	return (<MainBox bgColor={variables.mainbgcolor}>
		<div id="gameField" className={`${themes[`theme${user.theme}`]} ${styles.gameField} ${styles.result} `} style={{ "--bgTheme": user?.themeColor } as React.CSSProperties}>
			<h2>Match terminé</h2>
			{match.gaveUp && <span style={{ color: "firebrick" }}>{`${loserUsername} a quitté la partie`}</span>}
			<span>{`${winnerUsername} a remporté le match`}</span>
			<MatchBox watchable={false} player1={match.players[0]} player2={match.players[1]} gameId={match.id} score={{ p1: match.p1Score, p2: match.p2Score }} gaveUp={match.gaveUp} />
		</div>
	</MainBox>)
}
