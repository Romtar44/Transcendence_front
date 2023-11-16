import styles from './defyPopup.module.scss'
import React from "react"
import { displayWhatever } from "../../layout/main.layout"
import { Profil } from "../../lib/types/user.type"
import { sendWrapper } from "../../lib/utils"
import { socketFriend } from "../../socket"
import { Button } from "../button/button"
import { MyPopover } from "../popover/popover"
import { GameOption } from '../../pages/game/customGame'

type DefyPopupProps = {
	adversaire: Profil,
	gameId: string,
	customVar?: GameOption
}

export const DefyPopup: React.FC<DefyPopupProps> = ({ adversaire, gameId, customVar }) =>
{
	const accept = () =>
	{
		sendWrapper("put", "/game/startGame", (res) =>
		{
			window.location.pathname = `/game/${gameId}`
		}, () => void 0, { gameId, custom: customVar ? true : false, ...customVar })
	}

	const refuse = () =>
	{
		socketFriend.emit('refuseGame', gameId)
		displayWhatever(<div id='whatever' />)
	}

	return (<MyPopover display={true} setDisplay={() => void 0} crossDisplay={false}>
		<div className={styles.defyPopupCont}>
			<p>{adversaire.userName} vous invite a jouer.</p>
			<Button onClick={accept}>
				<span>Accepter</span>
			</Button>
			<Button onClick={refuse}>
				<span>Refuser</span>
			</Button>
		</div>
	</MyPopover>)
}
