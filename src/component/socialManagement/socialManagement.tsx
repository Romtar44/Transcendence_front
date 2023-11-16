import AddFriendLogo from '../../asset/addFriend.svg'
import RemoveFriendLogo from '../../asset/removeFriend.svg'
import BlockUserLogo from '../../asset/blockUser.svg'
import UnblockUserLogo from '../../asset/unblockUser.svg'
import profilIcon from '../../asset/profil.svg'
import battleIcon from '../../asset/battle.svg'
import CreateChannelLogo from '../../asset/createChannel.svg'
import LeaveChannelLogo from '../../asset/leaveChannel.svg'
import BellLogo from '../../asset/bell.svg'
import Image from '../../component/image/image'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { invitePlay, sendWrapper } from '../../lib/utils'
import { Channel, Profil } from '../../lib/types/user.type'
import styles from './socialManagement.module.scss'
import { Conv, UserContext } from '../../lib/context'
import { SearchFriend } from '../searchFriend/searchFriend'
import { MyPopover } from '../popover/popover'
import { ChannelManager } from '../channel/manageChannel/manageChannel'
import banIcon from '../../asset/banIcon.svg'
import muteIcon from '../../asset/muteIcon.svg'
import unmuteIcon from '../../asset/unmuteIcon.svg'
import addAdminIcon from '../../asset/addAdmin.svg'
import removeAdminIcon from '../../asset/removeAdmin.svg'
import ownerIcon from '../../asset/ownerIcon.svg'
import kickIcon from '../../asset/kickIcon.svg'
import channelMember from '../../asset/channelMember.svg'
import { DeleteIcon } from '@chakra-ui/icons'
import { useNavigate } from 'react-router-dom'
import { displayRequestStatus, displayWhatever } from '../../layout/main.layout'
import { LoaderAwait } from '../loader/loader'
import { Button } from '../button/button'
import { socketFriend } from '../../socket'

type SocialManagementProps = {
	w?: string
	withTitle?: boolean,
	friendId?: string,
	channelId?: string,
	activeConv?: Conv,
	channel?: Channel,
	profil?: Profil,
	setActiveConv?: (Profil?: Profil | Channel) => void
	setDisplayPop?: React.Dispatch<React.SetStateAction<boolean>>
}

type ChannelRemovalProps = {
	w?: string,
	channelId: string,
}

type ManageUserChannelProps = {
	channel?: Channel,
	channelId: string,
	userId?: string,
	w?: string,
	displayPop?: boolean,
	setDisplayPop?: React.Dispatch<React.SetStateAction<boolean>>,
	setMemberList?: React.Dispatch<React.SetStateAction<Profil[]>>
}

export const DestroyChannel: React.FC<ManageUserChannelProps> = ({
	channelId,
	w = "20px"
}) =>
{
	const { user } = useContext(UserContext)

	const handleSuccess = () =>
	{
		displayRequestStatus(true, "Le salon a bien été détruit")
	}

	const handleError = (res?: any) =>
	{
		displayRequestStatus(false, "Le salon n'a pas été détruit")

	}

	const destroyChannel = () =>
	{
		sendWrapper("put", "/channel/destroy-channel", handleSuccess, handleError, { userId: user?.id, channelId: channelId })
	}


	return (
		<div style={{ cursor: 'pointer' }} title='Bannir' onClick={destroyChannel}>
			<DeleteIcon w={w} h={w} color='white' />
			<span>Détruire le channel</span>
		</div>
	)
}


export const InviteToChannel: React.FC<SocialManagementProps> = ({
	w = "20px",
	withTitle = true,
	setDisplayPop
}) =>
{
	return (
		<div style={{ cursor: 'pointer' }} title='Quitter le salon'
			onClick={() =>
			{
				if (setDisplayPop)
					setDisplayPop(true)

			}}>
			<Image imgSrc={AddFriendLogo} alt="Inviter un ami" w={w} h={w} />
			{
				withTitle && <span>Inviter un ami</span>
			}
		</div>
	)
}

export const ChannelMember: React.FC<ManageUserChannelProps> = ({
	channelId,
	w = "20px",
	displayPop,
	setDisplayPop,
	setMemberList,
}) =>
{
	const getMemberProfil = useCallback(() =>
	{
		const handleSuccess = (res: any) =>
		{
			if (setMemberList)
				setMemberList(res.data)
		}

		const handleError = (res?: any) =>
		{
			displayRequestStatus(false, "Impossible d'obtenir la liste des membres du salon")
		}


		sendWrapper("get", `/channel/member-profil-channel/${channelId}`, handleSuccess, handleError)

	}, [channelId, setMemberList])

	useEffect(() =>
	{
		if (displayPop)
			getMemberProfil()


		// eslint-disable-next-line
	}, [displayPop])

	return (
		<div style={{ cursor: 'pointer' }} title='Liste des membres du salon' onClick={() =>
		{
			if (setDisplayPop)
				setDisplayPop(true)
		}}>
			<Image imgSrc={channelMember} alt='ChannelMember' w={w} h={w} />
			<span>Liste des membres</span>
		</div>
	)
}


export const BanList: React.FC<ManageUserChannelProps> = ({
	channelId,
	w = "20px",
	setDisplayPop,
	setMemberList
}) =>
{

	const handleSuccess = (res: any) =>
	{
		if (setMemberList)
			setMemberList(res.data)
		if (setDisplayPop)
			setDisplayPop(true)
	}

	const handleError = (res?: any) =>
	{
		displayRequestStatus(false, "Impossible d'obtenir la liste des bannis du salon")

	}

	const getMemberProfil = () =>
	{
		sendWrapper("get", `/channel/ban-profil-channel/${channelId}`, handleSuccess, handleError)
	}

	return (
		<div style={{ cursor: 'pointer' }} title='Liste des membres du salon' onClick={getMemberProfil}>
			<Image imgSrc={banIcon} alt='ChannelMember' w={w} h={w} />
			<span>Liste des bannis</span>
		</div>
	)
}


export const BanUser: React.FC<ManageUserChannelProps> = ({
	channelId,
	userId,
	w = "20px"
}) =>
{

	const handleSuccess = () =>
	{
		displayRequestStatus(true, "L'utilisateur a été bannis du salon")
	}

	const handleError = (res?: any) =>
	{
		displayRequestStatus(false, "Impossible de bannir l'utilisateur")
	}

	const banUser = () =>
	{
		sendWrapper("put", "/channel/ban-user-channel", handleSuccess, handleError, { userId: userId, channelId: channelId })
	}

	return (
		<div style={{ cursor: 'pointer' }} title='Bannir' onClick={banUser}>
			<Image imgSrc={banIcon} alt="Bannir" w={w} h={w} />
			<span>Bannir</span>
		</div>
	)
}

export const KickUser: React.FC<ManageUserChannelProps> = ({
	channelId,
	userId,
	w = "20px"
}) =>
{

	const handleSuccess = () =>
	{
		displayRequestStatus(true, "L'utilisateur a bien été expulser du salon")

	}

	const handleError = (res?: any) =>
	{
		displayRequestStatus(false, "Impossible d'expulser l'utilisateur du salon")

	}

	const kickUser = () =>
	{
		sendWrapper("put", "/channel/kick-channel", handleSuccess, handleError, { channelId, userId })
	}

	return (
		<div onClick={kickUser}>
			<Image imgSrc={kickIcon} alt='Expulser' w={w} h={w} />
			<span>Expulser</span>
		</div>
	)
}

export const MuteUser: React.FC<ManageUserChannelProps> = ({
	channelId,
	userId,
	w = "20px"
}) =>
{

	const handleSuccess = () =>
	{
		displayRequestStatus(true, "L'utilisateur est muet")

	}

	const handleError = (res?: any) =>
	{
		displayRequestStatus(false, "Impossible de rendre muet l'utilisateur du salon")

	}

	const muteUser = () =>
	{
		sendWrapper("put", "/channel/mute-user-channel", handleSuccess, handleError, { channelId, userId })
	}

	return (
		<div onClick={muteUser}>
			<Image imgSrc={muteIcon} alt='Rendre muet' w={w} h={w} />
			<span>Rendre muet</span>
		</div>
	)
}

export const UnmuteUser: React.FC<ManageUserChannelProps> = ({
	channelId,
	userId,
	w = "20px"
}) =>
{

	const handleSuccess = () =>
	{
		displayRequestStatus(true, "L'utilisateur n'est plus muet")

	}

	const handleError = (res?: any) =>
	{
		displayRequestStatus(false, "Impossible de rendre la voix à l'utilisateur")

	}

	const unmuteUser = () =>
	{
		sendWrapper("put", "/channel/unmute-user-channel", handleSuccess, handleError, { channelId, userId })
	}

	return (
		<div onClick={unmuteUser}>
			<Image imgSrc={unmuteIcon} alt='Rendre la voix' w={w} h={w} />
			<span>Rendre la voix</span>
		</div>
	)
}


export const AddAdmin: React.FC<ManageUserChannelProps> = ({
	channelId,
	userId,
	w = "20px"
}) =>
{

	const handleSuccess = () =>
	{
		displayRequestStatus(true, "L'utilisateur est maintenant administateur")

	}

	const handleError = (res?: any) =>
	{
		displayRequestStatus(false, "Impossible de rendre l'utilisateur administrateur")

	}

	const addAdmin = () =>
	{
		sendWrapper("put", "/channel/add-admin-channel", handleSuccess, handleError, { channelId, userId })
	}

	return (
		<div onClick={addAdmin} title='Accorde les droit dadministrateur'>
			<Image imgSrc={addAdminIcon} alt='Ajouter un administrateur' w={w} h={w} />
			<span>Ajouter admin</span>
		</div>
	)
}

export const RemoveAdmin: React.FC<ManageUserChannelProps> = ({
	channelId,
	userId,
	w = "20px"
}) =>
{

	const handleSuccess = () =>
	{
		displayRequestStatus(true, "L'utilisateur n'est plus admin")

	}

	const handleError = (res?: any) =>
	{
		displayRequestStatus(false, "Impossible d'enlever les droits d'administrateur a cette utilisateur")

	}

	const removeAdmin = () =>
	{
		sendWrapper("put", "/channel/remove-admin-channel", handleSuccess, handleError, { channelId, userId })
	}

	return (
		<div onClick={removeAdmin} title='Retirer les droits administateur'>
			<Image imgSrc={removeAdminIcon} alt='Retirer les droits' w={w} h={w} />
			<span>Retirer admin</span>
		</div>
	)
}

export const ChangeOwner: React.FC<ManageUserChannelProps> = ({
	channelId,
	userId,
	w = "20px"
}) =>
{

	const handleSuccess = () =>
	{
		displayRequestStatus(true, "La propriété du salon a bien été transmise")

	}

	const handleError = (res?: any) =>
	{
		displayRequestStatus(false, "Impossible de transmettre la propriété du salon")
	}

	const changeOwner = () =>
	{
		sendWrapper("put", "/channel/transmit-channel", handleSuccess, handleError, { channelId, userId })
	}

	return (
		<div onClick={changeOwner} title='Léguer le salon'>
			<Image imgSrc={ownerIcon} alt='Changer de propriétaire' w={w} h={w} />
			<span>Léguer le salon</span>
		</div>
	)
}



export const NotificationBadge: React.FC<{ count: number, position?: "absolute" | "relative" }> =
	({ count, position = "absolute" }) =>
	{
		return (
			<div className={styles.notifBadge} style={{ position }}>
				{count}
			</div>
		)
	}

export const AddFriendPopover: React.FC<SocialManagementProps> = ({
	w = "20px",
	withTitle = false,

}) =>
{
	const { user } = useContext(UserContext);

	const [displayPopover, setDisplayPopover] = useState(false)
	const [userList, setUserList] = useState<Profil[] | undefined>(undefined)

	useEffect(() =>
	{
		if (displayPopover)
		{
			sendWrapper("get", '/profil/getProfilAddable',
				(res) =>
				{
					setUserList(res?.data)
				},
				() => void 0)
		}

	}, [displayPopover])

	const handleClick = () =>
	{
		setDisplayPopover(prev => !prev)
	}


	return (
		<div style={{ cursor: 'pointer' }} title='Ajouter un ami'>
			<div onClick={handleClick} style={{ position: 'relative' }}>
				<Image imgSrc={AddFriendLogo} alt="Ajouter un ami" w={w} h={w} />
				<NotificationBadge count={user?.pendingList.length || 0} />
			</div>
			{
				withTitle &&
				<span>Ajouter</span>
			}
			<MyPopover setDisplay={setDisplayPopover} display={displayPopover} >
				{
					userList && userList?.length > 0 ?
						<SearchFriend profils={userList} className={styles.searchBar} />
						:
						<div className={styles.noUser} >
							Aucun utilisateur disponible
						</div>
				}
			</MyPopover>
		</div>
	)
}

export const BlockList: React.FC<SocialManagementProps> = ({
	w = "20px",
}) =>
{
	const [displayPop, setDisplayPop] = useState(false)
	const [blockList, setBlockList] = useState<Profil[]>([])

	const handleSuccess = (res?: any) =>
	{
		setBlockList(res.data)
	}

	const handleError = (res?: any) =>
	{
		displayRequestStatus(false, "Impossible de récupérer la liste d'utilisateur bloqué")
	}

	return (
		<div style={{ position: "relative", justifyContent: "center" }}>
			<div title="Liste des utilisateurs bloqués" onClick={() =>
			{
				sendWrapper('get', '/user/getBlockList', handleSuccess, handleError)
				setDisplayPop(true)
			}}>
				<Image imgSrc={UnblockUserLogo} alt="Débloquer l'utilisateur" h={w} w={w} />
			</div>
			<MyPopover setDisplay={setDisplayPop} display={displayPop}>
				{
					blockList.length ?
						<SearchFriend profils={blockList} unblock={true} className={styles.searchBar} />
						:
						<div className={styles.noUser} >
							Aucun utilisateur bloqué
						</div>
				}
			</MyPopover>
		</div>
	)
}

export const AddChannel: React.FC<SocialManagementProps> = ({
	w = "20px",
}) =>
{
	const [displayPop, setDisplayPop] = useState(false)
	const [channelList, setChannelList] = useState<Channel[] | undefined>(undefined)
	const { user } = useContext(UserContext)

	const handleSuccess = (res?: any) =>
	{
		setChannelList(res?.data)
		if (!displayPop)
			setDisplayPop(true)
	}

	const handleError = (res?: any) =>
	{
		displayRequestStatus(false, "Impossible de récupérer la liste des salons")
	}

	return (
		<div style={{ cursor: 'pointer' }} title='Rejoindre ou créer un salon' >
			<div style={{ position: 'relative' }} onClick={
				() => sendWrapper("get", '/channel/getChannelAddable',
					handleSuccess, handleError)
			}>
				<Image imgSrc={CreateChannelLogo} alt="Créer un salon" w={w} h={w} />
				<NotificationBadge count={user?.channelPendingList.length || 0} />
			</div>
			<ChannelManager displayPop={displayPop} setDisplayPop={setDisplayPop} channelList={channelList} />
		</div>
	)
}

export const RemoveFriend: React.FC<SocialManagementProps> = ({
	w = "20px",
	friendId,
	activeConv,
	setActiveConv = () => void 0,
	withTitle = false,
}) =>
{
	const { updateUser } = useContext(UserContext)

	const handleSuccess = () =>
	{
		if (activeConv && activeConv.friendOrConvId === friendId)
			setActiveConv(undefined)
		updateUser()
		displayRequestStatus(true, "L'utilisateur a bien été retirer de votre liste d'amis")

	}

	const handleError = (res?: any) =>
	{
		displayRequestStatus(false, "L'utilisateur n'a pas été retirer de votre liste d'amis")

	}

	const removeFriend = () =>
	{
		sendWrapper("post", "/social/remove-friend",
			handleSuccess, handleError, { userId: friendId })
	}

	return (
		<div style={{ cursor: 'pointer' }} title="Retirer de la liste d'am" onClick={() => removeFriend()}>
			<Image imgSrc={RemoveFriendLogo} alt="Retirer de la liste d'ami" w={w} h={w} />
			{withTitle && <span>Supprimer</span>}
		</div>
	)
}

export const UnblockUser: React.FC<SocialManagementProps> = ({
	w = "20px",
	friendId,
	withTitle
}) =>
{
	const { updateUser } = useContext(UserContext)

	const handleSuccess = () =>
	{
		updateUser()
		displayRequestStatus(true, "L'utilisateur a bien été débloqué")

	}

	const handleError = (res?: any) =>
	{
		displayRequestStatus(false, "L'utilisateur n'a pas été débloqué")

	}

	const unblockUser = () =>
	{
		sendWrapper("post", "/social/unblock-user", handleSuccess, handleError, { userId: friendId })
	}

	return (
		<div style={{ cursor: 'pointer' }} title="Débloquer l'utilisateur" onClick={unblockUser}>
			<Image imgSrc={UnblockUserLogo} alt="Bloquer l'utilisateur" w={w} h={w} />
			{withTitle && <span>Débloquer</span>}
		</div>
	)
}

export const BlockUser: React.FC<SocialManagementProps> = ({
	w = "20px",
	friendId,
	withTitle
}) =>
{
	const { updateUser } = useContext(UserContext)

	const handleSuccess = () =>
	{
		updateUser()
		displayRequestStatus(true, "L'utilisateur a bien été bloqué")

	}

	const handleError = (res?: any) =>
	{
		displayRequestStatus(false, "L'utilisateur n'a pas été bloqué")

	}

	const blockUser = () =>
	{
		sendWrapper("post", "/social/block-user", handleSuccess, handleError, { userId: friendId })
	}

	return (
		<div style={{ cursor: 'pointer' }} title="Bloquer l'utilisateur" onClick={blockUser}>
			<Image imgSrc={BlockUserLogo} alt="Bloquer l'utilisateur" w={w} h={w} />
			{withTitle && <span>Bloquer</span>}
		</div>
	)
}


export const LeaveChannel: React.FC<ChannelRemovalProps> = ({
	w = "20px",
	channelId,
}) =>
{
	const { updateUser, updateChannelList } = useContext(UserContext);

	const handleSuccess = () =>
	{
		updateChannelList()
		updateUser()
		displayRequestStatus(true, "Vous avez quitté le salon")

	}

	const handleError = () =>
	{
		displayRequestStatus(false, "Vous n'avez pas quitté le salon")

	}

	const leaveChannel = (channelId: string) =>
	{
		sendWrapper("put", '/channel/remove-channel', handleSuccess, handleError, { channelId })
	}

	return (
		<div style={{ cursor: 'pointer' }} title='Quitter le salon' onClick={() => leaveChannel(channelId)}>
			<Image imgSrc={LeaveChannelLogo} alt="vilaine" w={w} h={w} />
			<span>Quitter le salon</span>
		</div>
	)
}

export const Notification: React.FC<SocialManagementProps> = ({
	w = "20px",
}) =>
{
	return (
		<div style={{ cursor: 'pointer' }} title='Quitter le salon'>
			<Image imgSrc={BellLogo} alt="vilaine" w={w} h={w} />
		</div>
	)
}


export const InvitePlay: React.FC<SocialManagementProps> = ({
	w = "20px",
	withTitle,
	profil
}) =>
{


	const cancelInvite = (res: any)=> {
		socketFriend.emit("refuseGame", res.data.id)
		socketFriend.off(`accept${res.data.id}`)
		socketFriend.off(`refused${res.data.id}`)
		displayWhatever(undefined, true)

	}
	const navigate = useNavigate()
	const loaderAwait = (
		<div>
			<LoaderAwait username={`${profil?.userName}`} />

		</div>
	)

	return (
		<div style={{ cursor: 'pointer' }} title='Defier' onClick={() => invitePlay(navigate, loaderAwait, profil)}>
			<Image imgSrc={battleIcon} alt="Defier" w={w} h={w} />
			{withTitle && <span>Défier</span>}
		</div>
	)
}


export const SeeProfil: React.FC<SocialManagementProps> = ({
	w = "20px",
	withTitle,
	profil
}) =>
{
	const navigate = useNavigate()
	return (
		<div style={{ cursor: 'pointer' }} title='Quitter le salon'
			onClick={() =>
			{
				navigate('/profil', { state: { profil: { ...profil } } })
			}}>
			<Image imgSrc={profilIcon} alt="profil" w={w} h={w} />
			{
				withTitle &&
				<span>Profil</span>
			}
		</div>
	)
}

export const AddFriend: React.FC<SocialManagementProps> = ({
	w = "20px",
	friendId,
	withTitle = true
}) =>
{
	const { updateUser } = useContext(UserContext);

	const handleSuccess = () =>
	{
		updateUser()
		displayRequestStatus(true, "L'utilisateur a été ajouter à votre liste d'amis")
	}

	const handleError = (res?: any) =>
	{
		displayRequestStatus(false, "L'utilisateur n'a pas été ajouter à votre liste d'amis")

	}

	const addFriend = () =>
	{
		sendWrapper("post", '/social/add-new-friend', handleSuccess,
			handleError, { userId: friendId })
	}
	return (
		<div style={{ cursor: 'pointer' }} title='Ajouter en ami' onClick={addFriend}>
			<Image imgSrc={AddFriendLogo} alt="vilaine" w={w} h={w} />
			{withTitle && <span>Ajouter</span>}
		</div>
	)
}
