import { AxiosResponse } from 'axios'
import { Conv, UserContext } from '../../../lib/context'
import { Channel, Profil } from '../../../lib/types/user.type'
import { sendWrapper } from '../../../lib/utils'
import Avatar from '../../avatar/avatar'
import { BanList, ChannelMember, DestroyChannel, InviteToChannel, LeaveChannel } from '../../socialManagement/socialManagement'
import styles from './channelBox.module.scss'
import { useContext, useState } from 'react'
import { AddIcon, LockIcon } from '@chakra-ui/icons'
import { Input } from '../../input/input'
import { Button } from '../../button/button'
import manageIcon from '../../../asset/manage.svg'
import chevronRight from '../../../asset/chevronRight.svg'
import Image from '../../image/image'
import variables from './../../../global.scss'
import { MyPopover } from '../../popover/popover'
import { SearchFriend } from '../../searchFriend/searchFriend'
import { displayRequestStatus } from '../../../layout/main.layout'
import { StatusIcon } from '../../statusIcon/statusIcon'

type ChannelBoxProps = {
	channel: Channel
	avatarSize?: string
	setActiveConv?: (friendProfil: Profil | Channel) => void,
	activeConv: Conv | undefined
	displayButton?: boolean
	addable?: boolean
	setDisplayPop: React.Dispatch<React.SetStateAction<boolean>>
}

type MenuChanelActionsProps = {
	channel: Channel
}

const MenuChannelActions: React.FC<MenuChanelActionsProps> = ({
	channel
}) =>
{
	const { user, friendList } = useContext(UserContext)
	const [displayPopover, setDisplayPopover] = useState(false)
	const [displayBanPopover, setDisplayBanPopover] = useState(false)
	const [displayInvitePopover, setDisplayInvitePopover] = useState(false)

	const [memberList, setMemberList] = useState<Profil[]>([])
	const [banList, setBanList] = useState<Profil[]>([])

	const [displayMembersPop, setDisplayMembersPop] = useState(false)

	const addableFriend = friendList.filter((profil) => !channel?.memberId.includes(profil.userId) && !channel?.banList.includes(profil.userId))

	return (
		<div className={styles.menuAction}>
			<div tabIndex={-1} className={styles.icon} onFocus={() => setDisplayPopover(prev => !prev)} onBlur={() => setDisplayPopover(prev => !prev)}>
				<Image imgSrc={manageIcon} alt='action' />
				{
					displayPopover &&
					<ul className={styles.menu}>
						<li key="inviteFriend">
							<InviteToChannel channel={channel} withTitle={true} w='23px' setDisplayPop={setDisplayInvitePopover} />
						</li>
						<li key="leaveChannel">
							<LeaveChannel channelId={channel.id} w='23px' />
						</li>
						<li key="memberList" >
							<ChannelMember setDisplayPop={setDisplayMembersPop} displayPop={displayMembersPop} setMemberList={setMemberList} channelId={channel.id} w='23px' />
						</li>
						{
							user?.id === channel.ownerId &&
							<li key="deleteChannel">
								<DestroyChannel channelId={channel.id} w='18px' />
							</li>
						}
						{
							user && channel.adminId.includes(user?.id) &&
							<li>
								<BanList channelId={channel.id} channel={channel} setDisplayPop={setDisplayBanPopover} setMemberList={setBanList} />
							</li>
						}
					</ul>
				}
			</div>
			{
				displayMembersPop &&
				<div className={styles.menu}>
					<MyPopover display={displayMembersPop} setDisplay={setDisplayMembersPop}>
						<SearchFriend profils={memberList} forChannel={true} channel={channel} />
					</MyPopover>
				</div>
			}
			{
				displayBanPopover && user && channel?.adminId.includes(user?.id) &&
				<MyPopover display={displayBanPopover} setDisplay={setDisplayBanPopover}>
					<SearchFriend profils={banList} forChannel={false} channel={channel} isBanned={true} setDisplayPop={setDisplayBanPopover} />
				</MyPopover>

			}
			{
				displayInvitePopover &&
				<div className={styles.menu}>
					<MyPopover display={displayInvitePopover} setDisplay={setDisplayInvitePopover}>
						<SearchFriend profils={addableFriend} forChannel={true} channel={channel}
							setDisplayPop={setDisplayInvitePopover}
							addable={true} />
					</MyPopover>
				</div>
			}
		</div>)
}

export const ChannelBox: React.FC<ChannelBoxProps> = ({
	channel,
	avatarSize = "40px",
	setActiveConv = () => void 0,
	displayButton = true,
	addable = false,
	setDisplayPop,
	activeConv
}) =>
{
	const { user, updateChannelList } = useContext(UserContext)
	const [isProtected, setProtectedMode] = useState(false)
	const [inputValues, setInputValues] = useState<Record<string, string>>({
		password: "",
	})

	const handleError = (res?: any) =>
	{
		displayRequestStatus(false, "Vous ne pouvez pas entrer dans ce salon")
	}

	const handleSuccess = async (res?: AxiosResponse<any, any> | undefined,) =>
	{
		if (res?.data.message === "PROTECTED")
		{
			setProtectedMode(true)
		}
		else
		{
			setProtectedMode(false)
			setDisplayPop(false)
			updateChannelList()
			displayRequestStatus(true, "Vous êtes entré dans le salon")
		}
	}

	const enterRequest = (channelId: string) =>
	{
		sendWrapper("put", "/channel/enter-channel", handleSuccess, handleError, { channelId: channelId })
	}

	return (
		<div className={`${styles.channelBoxContainer} ${activeConv?.friendOrConvId === channel.id ? styles.activeChannel : undefined}`}
			key={channel.id}
			onClick={() => setActiveConv(channel)}>
			{
				!isProtected &&
				<div className={styles.channelInfo}>
					<div className={styles.pp}>
						<Avatar id={channel.avatarId.toString()} size={avatarSize} />
					</div>
					<div className={styles.userName}>
						<span >
							{channel.channelName}
							{
								addable && channel.status === "PROTECTED" &&
								<LockIcon w='15px' color={'white'} />
							}
						</span>
						<div className={styles.invitedStatus}>
							{
								user && !channel.memberId.includes(user.id) && channel.invitedList.includes(user.id) &&
								< StatusIcon profil={undefined} isPending={true} className={styles.invitedStatus} w='16px' />
							}
						</div>
					</div>
				</div>
			}
			<div className={styles.channelOption}>
				{
					displayButton &&
					<MenuChannelActions channel={channel} />
				}
				{
					!isProtected && addable &&
					<div style={{ cursor: 'pointer' }} title={"Ajouter le salon"} onClick={() => enterRequest(channel.id)}>
						<AddIcon color='white' />
					</div>
				}
			</div>
			{
				isProtected &&
				<form onSubmit={(e) =>
				{
					e.preventDefault()
					sendWrapper("put", "/channel/enter-protected-channel", handleSuccess, handleError, { channelId: channel.id, password: inputValues.password })
				}} className={styles.protectedInputContainer}>
					<Avatar id={channel.avatarId.toString()} size={avatarSize} />
					<Input type='password' fontSize="16px" color="black"
						placeHolder="Mot de passe" border="1px solid black"
						bgColor={variables.socialcolor}
						setValue={(input: string) => setInputValues((prevInputs) => ({ ...prevInputs, password: input }))} />

					<Button type="submit" className={styles.validateContainer}>
						<Image imgSrc={chevronRight} alt='Valider' w='25px' />
					</Button>
				</form>
			}
		</div >
	)
}
