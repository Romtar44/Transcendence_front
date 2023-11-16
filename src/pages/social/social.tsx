import Avatar from '../../component/avatar/avatar'
import styles from './social.module.scss'
import variables from '../../global.scss'
import MainBox from '../../component/mainBox/mainBox'
import { useCallback, useContext, useEffect, useState } from 'react'
import { ProfilBox } from '../../component/profilBox/profilBox'
import { StatusIcon } from '../../component/statusIcon/statusIcon'
import { Loader } from '../../component/loader/loader'
import { AddChannel, AddFriendPopover } from '../../component/socialManagement/socialManagement'
import { Conv, UserContext } from '../../lib/context'
import Username from '../../component/username/username'
import { ChannelBox } from '../../component/channel/channelBox/channelBox'
import { MessgageThreads } from '../../component/message/messageBox'
import React from 'react'
import { useMediaQuery } from '@chakra-ui/react'
import { isUserInPending } from '../../lib/utils'
import { Channel, Convervsation, Profil } from '../../lib/types/user.type'
import { socketChat } from '../../socket'

type Variant = "Friend" | "Channel"

type SocialBoxProps = {
	setActiveConv: (profil?: Profil | Channel) => void
	type?: Variant
	activeConv: Conv | undefined
}

export function isProfil(profil?: Profil | Channel): profil is Profil
{
	return (profil as Profil).userName !== undefined;
}

export const ParamBox = () =>
{
	const { user } = useContext(UserContext);
	if (!user)
		return <Loader />
	return (
		<div className={styles.paramBoxContainer}>
			<div className={styles.pp}>
				<Avatar size='100%' id={user.profil.avatarId.toString()} />
			</div>
			<div className={styles.delimitor} />
			<div className={styles.statusContainer}>
				<div className={styles.status}>
					<Username username={user.profil.userName} fontSize='23px' />
					<StatusIcon profil={user.profil} w='16px' />
				</div>
				<div>
					<div className={styles.socialOption}>
						<AddFriendPopover w='32px' />
						<AddChannel w='32px' />
					</div>
				</div>
			</div>
		</div>
	)
}

export const SocialBox: React.FC<SocialBoxProps> = ({
	type = "Friend",
	setActiveConv,
	activeConv,

}) =>
{
	const { user, friendList, channelList } = useContext(UserContext);
	const [stateIO, changeState] = useState<boolean>(true)

	if (!user)
		return null

	let activeFriend = 0
	friendList.forEach((friend) =>
	{
		if (friend.status !== "OFFLINE" && !isUserInPending(friend, user))
			activeFriend += 1
	})

	return (
		<div className={styles.socialBoxContainer}>
			<div className={styles.title}>
				<div className={`${styles.triangleProps}
					${stateIO === true && styles.triangleOpen} ${stateIO === false && styles.triangleClose}`}
					onClick={() => changeState((prev) => !prev)} />
				<span>
					{
						type === "Friend" ?
							`Friend (${activeFriend} / ${friendList?.length} )` :
							`Channel (${user && channelList.length})`
					}
				</span>
			</div>
			{
				type === "Friend" ?
					(stateIO && friendList?.map((friend) =>
						< ProfilBox activeConv={activeConv} setActiveConv={setActiveConv} isFriend={true} key={friend.id} profil={friend} />))
					: (stateIO && channelList?.map((channel) =>
						<ChannelBox setActiveConv={setActiveConv} activeConv={activeConv} channel={channel} key={channel.id} setDisplayPop={() => void 0} />))
			}
		</div>
	)
}



export const Social = () =>
{
	const { user, convList, channelList, activeConv, setActiveConv, setConvList } = useContext(UserContext);
	const [isMobile] = useMediaQuery(`(max-width: ${variables.mobilebreakpoint})`)
	const [displayMenu, openMenu] = useState(true)

	const setConv = useCallback((profil?: Profil | Channel) =>
	{
		if (activeConv && activeConv.id && isProfil(activeConv.profil))
			socketChat.emit('seeConv', { convId: activeConv.id }, (socketRes: { status: string, newConv: Convervsation }) =>
			{
				const { newConv } = { ...socketRes }
				 if (!newConv)
				 	return
				var convListTmp = convList.slice()
				var idx = convList.findIndex((conv) => conv.id === newConv.id)
				convListTmp[idx].messages = newConv.message
				setConvList(convListTmp)
			})
		if (!profil)
		{
			setActiveConv(undefined)
			return
		}
		openMenu(false)
		if (isProfil(profil))
		{
			const foundConv = convList.find((elem) => (elem.friendOrConvId === profil.userId))
			socketChat.emit('seeConv', { convId: foundConv?.id }, (socketRes: { status: string, newConv?: Convervsation }) =>
			{
				setActiveConv({
					id: foundConv?.id || undefined,
					friendOrConvId: profil.userId,
					messages: socketRes.newConv?.message || [],
					profil: profil
				})
			})
		}
		else
		{
			setActiveConv({
				id: profil?.id || undefined,
				friendOrConvId: profil.id,
				messages: profil?.conv || [],
				profil: profil
			})
		}
	}, [activeConv, convList, setActiveConv, setConvList])

	useEffect(() =>
	{
		if (activeConv && activeConv.id === undefined)
		{
			const conv = convList.find((elem) => elem.friendOrConvId === activeConv.friendOrConvId)
			if (conv)
				setActiveConv({ profil: activeConv.profil, ...conv })
		}
		// eslint-disable-next-line
	}, [convList, activeConv])

	useEffect(() =>
	{
		const activeChannel = channelList.find(chan => chan.id === activeConv?.friendOrConvId)
		if (activeChannel)
		{
			setConv(activeChannel)
		}
		// eslint-disable-next-line
	}, [channelList])

	if (!user)
		return null


	return (
		<MainBox bgColor={variables.socialcolor}>
			<div className={styles.socialContainer}>
				{activeConv && (!isMobile || !displayMenu) ?
					<MessgageThreads activeConv={activeConv} setActiveConv={setConv} />
					:
					!isMobile && <div />}
				{(!isMobile || displayMenu) &&
					<div className={styles.chatMenuContainer}>
						<ParamBox />
						<div className={styles.friendAndChannels}>
							<SocialBox activeConv={activeConv} setActiveConv={setConv} type='Friend' />
							<SocialBox activeConv={activeConv} setActiveConv={setConv} type='Channel' />
						</div>
					</div>
				}
				{isMobile && <div className={styles.hideChatMenuContainer} onClick={() => openMenu(prev => !prev)}>...</div>}
			</div>
		</MainBox >
	)
}


