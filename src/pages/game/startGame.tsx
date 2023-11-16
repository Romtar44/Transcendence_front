import { useContext, useState } from "react"
import { UserContext } from "../../lib/context"
import styles from './game.module.scss'
import variables from '../../global.scss'
import { Button } from "../../component/button/button"
import { SearchFriend } from "../../component/searchFriend/searchFriend"
import { MyPopover } from "../../component/popover/popover"
import { Mode } from "./gameHome"
import React from "react"
import { sendWrapper } from "../../lib/utils"
import { socketFriend } from "../../socket"
import { useNavigate } from "react-router-dom"
import { Loader } from "../../component/loader/loader"
import { useEffect } from "react"
import { displayRequestStatus } from "../../layout/main.layout"

type StartGameProps = {
	setMode: React.Dispatch<React.SetStateAction<Mode>>
}
export const StartGame: React.FC<StartGameProps> = ({ setMode }) =>
{

	const { user, friendList } = useContext(UserContext)
	const [matchMakingAwait, setMatchMakingAwait] = useState(false)
	const [inviteStatus, setInviteStatus] = useState(false)

	let timeout: NodeJS.Timeout | null = null
	useEffect(() =>
	{
		return (() =>
		{
			sendWrapper("put", "/game/leaveMatchMaking", () => void 0, () => void 0)
			socketFriend.off(`foundMatch${user?.id}`)

			if (timeout)
				clearTimeout(timeout)

		})
		// eslint-disable-next-line
	}, [])

	const inviteFriend = () =>
	{
		setInviteStatus(true)
	}

	const navigate = useNavigate()

	const awaitFoundMatch = (res: any) =>
	{

		if (res.data.status === "no game found")
		{
			setMatchMakingAwait(true)
			socketFriend.on(`foundMatch${user?.id}`, (gameId: string) =>
			{
				navigate(`/game/${gameId}`)
				socketFriend.off(`foundMatch${user?.id}`)
				if (timeout)
					clearTimeout(timeout)
			})
			timeout = setTimeout(() =>
			{
				socketFriend.off(`foundMatch${user?.id}`)
				setMode(undefined)
				displayRequestStatus(false, "Aucun adversaire trouvé", 6000)
			}, 30000)


		}
		else
			navigate(`/game/${res.data.game.id}`)
	}


	const findMatchMaking = async () =>
	{
		sendWrapper("put", "/game/matchMaking", awaitFoundMatch, () => void 0)
	}
	if (matchMakingAwait)
		return (<Loader title="Recherche d'adversaire en cours" />
		)

	return (<div className={styles.gameHomeContainer}>
		<Button onClick={findMatchMaking} className={styles.buttonStyle} variant="squared" bgColor={variables.pinkcolor} color="white">
			<h2>Recherche d'adversaire</h2>
		</Button>
		<Button onClick={inviteFriend} className={styles.buttonStyle} variant="squared" bgColor={variables.pinkcolor} color="white">
			<h2>Inviter un ami</h2>
		</Button>
		{
			inviteStatus &&
			<MyPopover setDisplay={setInviteStatus} display={inviteStatus}>
				<SearchFriend isGame={true} profils={friendList} />
			</MyPopover>
		}
	</div>)

}
