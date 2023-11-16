import { useContext, useEffect, useState } from "react"
import { Conv, UserContext } from "../../lib/context"
import { Channel, Profil } from "../../lib/types/user.type"
import { SeeProfil, InvitePlay, RemoveFriend, BlockUser, BanUser, KickUser, MuteUser, UnmuteUser, AddAdmin, RemoveAdmin, ChangeOwner, AddFriend, UnblockUser } from "../socialManagement/socialManagement"
import styles from './actionPopover.module.scss'
import variables from "../../global.scss"


type MenuProfilActionsProps = {
	profil: Profil,
	setActiveConv?: (profil?: Profil | Channel) => void
	activeConv?: Conv | undefined
	friendId: string
	tooglePopover: JSX.Element
	isChannel?: boolean
	channel?: Channel
	bgColor?: string
	hoverColor?: string
}



export const MenuProfilActions: React.FC<MenuProfilActionsProps> = ({
	profil,
	setActiveConv,
	activeConv,
	friendId,
	tooglePopover,
	isChannel = false,
	channel,
	bgColor = variables.sociallightcolor,
	hoverColor
}) =>
{
	const [displayPopover, setDisplayPopover] = useState(false)
	const [rightPos, setRightPos] = useState<string | undefined>(undefined)
	const { user, friendList } = useContext(UserContext);

	const isSelf = friendId === user?.id
	const isAdmin = channel && user && channel.adminId.includes(user.id) ? true : false
	const isOwner = channel && user && channel.ownerId === user.id

	const isMuted = (id: string) =>
	{
		return channel?.mutedList.includes(id)
	}

	const isFriend = (id: string) =>
	{
		return friendList.find((profil) => profil.userId === id)
	}

	const isBlocked = (id: string) =>
	{
		return user?.blockList.includes(id)
	}

	const isUserAdmin = (id: string) =>
	{
		return channel?.adminId.includes(id)
	}

	const isUserOwner = (id: string) =>
	{
		return channel?.ownerId === id
	}

	useEffect(() =>
	{
		if (rightPos === undefined)
			setDisplayPopover(false)
		else
			setDisplayPopover(true)

	}, [rightPos])

	return (
		<div className={styles.menuAction} id={`menuIcon${friendId}`}>
			<div className={styles.icon}
				onBlur={() => setRightPos(undefined)}
				tabIndex={-1}>
				<div className={!isSelf ? styles.toggleContainer : undefined} onClick={(e) =>
				{
					if (!isSelf)
						setRightPos((e.nativeEvent.offsetX).toString() + "px")
				}
				}>
					{tooglePopover}
				</div>

				{
					displayPopover &&
					<ul className={styles.menu} style={{ top: "0px", left: rightPos, "--backgroundColor": bgColor } as React.CSSProperties}>
						<li key="seeprofil">
							<SeeProfil withTitle={true} w='23px' profil={profil}/>
						</li>
						<li key="inviteplay">
							<InvitePlay withTitle={true} w='23px' friendId={profil.userId} profil={profil} />
						</li>
						{
							isFriend(profil.userId) ?
								< li key="removefriend">
									<RemoveFriend friendId={profil.userId} activeConv={activeConv} withTitle={true} setActiveConv={setActiveConv} w='23px' />
								</li>
								:
								< li key="addFriend">
									<AddFriend friendId={profil.userId} w='23px' />
								</li>
						}
						{
							isBlocked(profil.userId) ?
								<li key="unblockUser">
									<UnblockUser friendId={profil.userId} w='23px' withTitle={true} />
								</li>
								:
								<li key="blockUser">
									<BlockUser friendId={profil.userId} w='23px' withTitle={true} />
								</li>
						}
						{
							isChannel && user && channel && isAdmin && !isUserOwner(profil.userId) && (isOwner || !isUserAdmin(profil.userId)) &&
							< div >
								<li key="banUser">
									<BanUser channelId={channel.id} userId={profil.userId} />
								</li>
								<li key="kickUser">
									<KickUser channelId={channel.id} userId={profil.userId} />
								</li>
								{
									isMuted(profil.userId) ?
										<li key="unMuteUser">
											<UnmuteUser channelId={channel.id} userId={profil.userId} />
										</li>
										:
										<li key="muteUser">
											<MuteUser channelId={channel.id} userId={profil.userId} />
										</li>

								}
							</div>
						}
						{
							isOwner && channel &&
							<div>
								<li key="addAdmin">
									<AddAdmin channelId={channel.id} userId={profil.userId} />
								</li>
								<li key="removeAdmin">
									<RemoveAdmin channelId={channel.id} userId={profil.userId} />
								</li>
								<li key="changeOwner">
									<ChangeOwner channelId={channel.id} userId={profil.userId} />
								</li>
							</div>
						}
					</ul>}
			</div>
		</div >
	)
}
