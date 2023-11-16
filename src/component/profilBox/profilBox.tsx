import { useContext } from 'react'
import { Conv, UserContext } from '../../lib/context'
import { Channel, Profil } from '../../lib/types/user.type'
import { invitePlay, isUserInPending, sendWrapper } from '../../lib/utils'
import Avatar from '../avatar/avatar'
import { AddFriend, BlockUser, NotificationBadge, RemoveFriend, UnblockUser } from '../socialManagement/socialManagement'
import { StatusIcon } from '../statusIcon/statusIcon'
import Username from '../username/username'
import styles from './profilBox.module.scss'
import { AddIcon, MinusIcon } from '@chakra-ui/icons'
import React from 'react'
import { MenuProfilActions } from '../actionPopover/actionPopoverProfil'
import { displayRequestStatus } from '../../layout/main.layout'
import { useNavigate } from 'react-router-dom'
import { LoaderAwait } from '../loader/loader'
import { GameOption } from '../../pages/game/customGame'


type UserBoxProps = {
	profil: Profil,
	avatarSize?: string,
	setActiveConv?: (profil?: Profil | Channel) => void
	isFriend?: boolean
	activeConv: Conv | undefined
	forChannel?: boolean
	channel?: Channel
	isBanned?: boolean,
	gameVar?: GameOption,
	setDisplayPop?: React.Dispatch<React.SetStateAction<boolean>>
	addable?: boolean
	isGame?: boolean
	unblock?: boolean
}


type UsernameAndPpProps = {
	avatarSize: string,
	profil: Profil,
	hasInvited?: boolean,
	isFriend?: boolean,
	isPending?: boolean,
	withStatus?: boolean,
	className?: string,
}


export const UserNameAndPP: React.FC<UsernameAndPpProps> = ({
	avatarSize,
	profil,
	hasInvited = false,
	isFriend = true,
	isPending = false,
	withStatus = true,
	className
}) =>
{
	return (
		<div className={styles.userInfo + " " + className}>
			<div className={styles.pp}>
				<Avatar size={avatarSize} id={profil.avatarId.toString()} />
				{
					withStatus && (hasInvited || isFriend) &&
					<StatusIcon isPending={isPending} hasInvited={hasInvited}
						profil={profil} className={styles.status} w='15px' />
				}
				<Username username={profil?.userName} fontSize='20px' />
			</div>
		</div>)
}


export const ProfilBox: React.FC<UserBoxProps> = ({
	profil,
	avatarSize = "40px",
	setActiveConv = () => void 0,
	isFriend = true,
	activeConv,
	forChannel = false,
	channel,
	gameVar,
	isBanned = false,
	setDisplayPop,
	addable = false,
	isGame = false,
	unblock = false
}) =>
{
	const { user, convList } = useContext(UserContext);
	const navigate = useNavigate()

	if (!user)
		return null

	const isPending = isUserInPending(profil, user)
	const hasInvited = user.pendingList.includes(profil.userId)

	if (isFriend)
		var associatedConv = convList.find(conv => conv.friendOrConvId === profil.userId)

	const unreadMsg = isFriend && associatedConv ? (associatedConv.messages.filter(msg => msg.senderId === profil.userId && msg.seen === false)).length : 0


	const handleBanError = (res?: any) =>
	{
		displayRequestStatus(false, "La grâce a échoué")
	}

	const handleBanSuccess = () =>
	{
		if (setDisplayPop)
			setDisplayPop(false)
		displayRequestStatus(true, "L'utilisateur nest plus bannis")
	}

	const handleInviteError = (res?: any) =>
	{
		displayRequestStatus(false, "L'invitation a échoué")
	}

	const handleInviteSuccess = () =>
	{
		if (setDisplayPop)
			setDisplayPop(false)
		displayRequestStatus(true, "L'invitation a bien été envoyé")
	}

	const inviteFriend = (invited: string) =>
	{
		sendWrapper('put', '/channel/invite-channel', handleInviteSuccess, handleInviteError, { channelId: channel?.id, userId: invited })
	}

	const unban = (unbanned: string) =>
	{
		sendWrapper('put', '/channel/unban-user-channel', handleBanSuccess, handleBanError, { channelId: channel?.id, userId: unbanned })
	}

	return (
		<div className={`
			${styles.userBoxContainer}
			${activeConv?.friendOrConvId === profil.userId && styles.activeConv}
			${isPending && styles.pendingFriend}`}
			key={profil.id} onClick={() =>
			{

				if (!isPending)
				{
					setActiveConv(profil)
				}

			}}
			title={isPending ? `Attendez que ${profil.userName} accepte votre invitation` : ""}>
			<div className={styles.profil}>
				{
					(isFriend && !isPending && !forChannel && !isGame) ?
						<MenuProfilActions profil={profil} activeConv={activeConv}
							setActiveConv={setActiveConv}
							friendId={profil.id}
							tooglePopover={<UserNameAndPP avatarSize={avatarSize} hasInvited={hasInvited} profil={profil} isPending={isPending} isFriend={isFriend} className={styles.profilMenu} />} />
						:
						forChannel ?
							<MenuProfilActions profil={profil} activeConv={activeConv}
								setActiveConv={setActiveConv}
								friendId={profil.id}
								isChannel={forChannel}
								channel={channel}
								tooglePopover={<UserNameAndPP avatarSize={avatarSize} hasInvited={false} profil={profil} isPending={false} isFriend={true} className={styles.profilMenu} />} />
							:
							<UserNameAndPP avatarSize={avatarSize} hasInvited={hasInvited} profil={profil} isPending={isPending} isFriend={isFriend} />
				}
			</div>
			<div className={styles.friendOption}>
				{
					!isFriend && !hasInvited && !isBanned && !unblock &&
					<div>
						<AddFriend w="25px" friendId={profil.userId} withTitle={false} />
						<BlockUser friendId={profil.userId} w='25px' />
					</div>
				}
				{
					hasInvited && !isBanned &&
					<div>
						<AddFriend w="25px" friendId={profil.userId} withTitle={false} />
						<RemoveFriend friendId={profil.userId} w='25px' />
					</div>
				}
				{
					isPending && !isBanned && !forChannel &&
					<RemoveFriend friendId={profil.userId} w='25px' />
				}
				{
					activeConv?.friendOrConvId !== profil.userId && isFriend && !isPending && unreadMsg > 0 &&
					<NotificationBadge position="relative" count={unreadMsg} />
				}
				{
					forChannel && !isBanned && addable &&
					<div onClick={() => inviteFriend(profil.userId)}>
						<AddIcon color='white' />
					</div>
				}
				{
					isBanned &&
					<div onClick={() => unban(profil.userId)}>
						<MinusIcon color='white' />
					</div>
				}
				{
					isGame &&
					<div onClick={() => invitePlay(navigate, <LoaderAwait username={`${profil?.userName}`} />, profil, gameVar)}>
						<AddIcon color='white' />
					</div>
				}
				{
					unblock &&
					<UnblockUser friendId={profil.userId} w='25px' />
				}
			</div>
		</div >
	)
}
