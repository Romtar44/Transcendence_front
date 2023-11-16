import styles from './profil.module.scss'
import { Button } from '../../component/button/button'
import { useContext, useState } from 'react'
import { ProfilAper } from './views/profil.aperçu'
import { ProfilStat } from './views/profil.stat'
import { Loader } from '../../component/loader/loader'
import MainBox from '../../component/mainBox/mainBox'
import variables from '../../global.scss'
import { UserContext } from '../../lib/context'
import { useLocation } from 'react-router-dom'
import { UserNameAndPP } from '../../component/profilBox/profilBox'
import { AddFriend, BlockUser, RemoveFriend, UnblockUser } from '../../component/socialManagement/socialManagement'

type State = "Aperçu" | "Stat"

export const Profil = () =>
{
	const location = useLocation();
	const [state, changeTab] = useState<State>((location.state && location.state.goToAccount) ? "Aperçu" : "Stat")
	const [lastState, changeLastState] = useState<State | undefined>(undefined)
	const { user, friendList } = useContext(UserContext);

	const isBlocked = (id: string) =>
	{
		return user?.blockList.includes(id)
	}

	const isFriend = () =>
	{
		let ret = false
		friendList.forEach((profil) =>
		{
			if (profil.userId === location.state.profil.userId)
				ret = true
		})
		return ret
	}

	if (!user)
		return <Loader />


	if (location.state && location.state.profil)
	{
		let friend = false
		friend = isFriend()
		return (
			<MainBox bgColor={variables.grenatcolor}>
				<div className={styles.profilContainer}>
					<div className={styles.profilView}>
						<UserNameAndPP className={styles.usernameAndPP} withStatus={false} profil={location.state.profil} avatarSize="40px" />
						<div className={styles.profilSocialOption}>
							{
								friend ? <RemoveFriend friendId={location.state.profil.userId} withTitle={false} w='30px' /> : <AddFriend friendId={location.state.profil.userId} withTitle={false} w='30px' />
							}
							{
								isBlocked(location.state.profil.userId) ?
									<UnblockUser friendId={location.state.profil.userId} withTitle={false} w='30px' />
									:
									<BlockUser friendId={location.state.profil.userId} withTitle={false} w='30px' />
							}
						</div>
						<ProfilStat profil={location.state.profil} />
					</div>
				</div>
			</MainBox >
		)
	}

	const elemTab: Record<State, JSX.Element> = {
		Aperçu: <ProfilAper />,
		Stat: <ProfilStat profil={user.profil} />,
	}

	const updateState = (nActive: State) =>
	{
		if (nActive !== state)
		{
			changeLastState(state)
			changeTab(nActive)
		}
	}

	return (
		<MainBox bgColor={variables.grenatcolor}>
			<div className={styles.profilContainer}>
				<div className={styles.profilMenu}>
					<div>
						<Button className={`${styles.profilButton} ${state === "Stat" && styles.active} ${lastState === "Stat" && styles.inactive}`} onClick={() => updateState("Stat")} mouseOver='Light' borderRadius='0px 100px 100px 0px'>
							<b>Profil</b>
						</Button>
						<Button className={`${styles.profilButton} ${state === "Aperçu" && styles.active} ${lastState === "Aperçu" && styles.inactive}`} onClick={() => updateState("Aperçu")} mouseOver='Light' borderRadius='0px 100px 100px 0px'>
							<b>Mon compte</b>
						</Button>
					</div>
				</div>
				<div className={styles.profilView}>
					{elemTab[state]}
				</div>
			</div>
		</MainBox >
	)
}
