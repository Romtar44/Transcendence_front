import { RatioCircle } from '../../pages/profil/views/profil.stat'
import { MenuProfilActions } from '../actionPopover/actionPopoverProfil'
import { BarLevel } from '../barLevel/barLevel'
import { UserNameAndPP } from '../profilBox/profilBox'
import variables from '../../global.scss'
import styles from './matchBox.module.scss'
import { Profil } from '../../lib/types/user.type'

type MatchBoxProps = {
	player1: Profil,
	player2: Profil,
	gameId: string,
	score?: { p1: number, p2: number }
	watchable: boolean
	seeResult?: boolean
	gaveUp?: string
}


export const MatchBox: React.FC<MatchBoxProps> = ({ player1, player2, gameId, score, watchable, gaveUp, seeResult = false }) =>
{


	if (!player1 || !player2)
	{
		return null
	}

	let winner: "player1" | "player2" | undefined = undefined
	if (score)
	{
		winner = score?.p1 > score.p2 ? "player1" : "player2"
		if (gaveUp)
		{
			winner = gaveUp === "player1" ? "player2" : "player1"

		}
	}


	const p1ratio = Math.round((player1.stats.win / (player1.stats.lose + player1.stats.win)) * 100)
	const p2ratio = Math.round((player2.stats.win / (player2.stats.lose + player2.stats.win)) * 100)

	return (
		<div className={styles.matchBoxCont}>
			<div className={styles.playersCont}>
				<div className={`${styles.player} ${winner ? (winner === "player1" ? styles.winner : styles.loser) : undefined}`}>
					<MenuProfilActions profil={player1} friendId={player1.userId}
						tooglePopover={<UserNameAndPP className={`${styles.player1}`} profil={player1} avatarSize={"30px"} withStatus={false} />}
						bgColor={variables.mainbgcolor} />
					<div className={styles.stats}>
						<BarLevel bgColor='white' progressionColor={"green"} w='100%' h='30px' percentage={`${player1.stats.percentXp}%`} placeHolder={`Niveau ${player1.stats.level}`} placeHolder2={`${player1.stats.xp} xp`} />
						<RatioCircle percent={p1ratio} fs="15px" />
					</div>
					{score && <i className={winner === 'player1' ? styles.scoreWinner : styles.scoreLoser}>{score.p1}</i>}
				</div>
				<h3 className={styles.vs}>VS</h3>
				<div className={`${styles.player} ${winner ? (winner === "player2" ? styles.winner : styles.loser) : undefined}`}>
					<MenuProfilActions profil={player2} friendId={player2.userId}
						tooglePopover={<UserNameAndPP profil={player2} avatarSize={"30px"} withStatus={false} />}
						bgColor={variables.mainbgcolor} />
					<div className={styles.stats}>
						<BarLevel bgColor='white' progressionColor={"green"} w='100%' h='30px' percentage={`${player2.stats.percentXp}%`} placeHolder={`Niveau ${player2.stats.level}`} placeHolder2={`${player2.stats.xp} xp`} />
						<RatioCircle percent={p2ratio} fs="15px" />
					</div>
					{score && <i className={winner === "player2" ? styles.scoreWinner : styles.scoreLoser}>{score.p2}</i>}
				</div>
			</div>
			{watchable &&
				<a href={`/game/${gameId}`}>Regarder le match</a>
			}

		</div>)
}
