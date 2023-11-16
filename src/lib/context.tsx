import * as React from "react"
import { useCallback, useState } from "react"
import { useEffect } from "react"
import { DefyPopup } from "../component/defyPopup/defyPopup"
import { logout } from "../component/logoutButton/logoutButton"
import { isSocketOn, socketChannel, socketChat, socketFriend, socketStatus } from "../socket"
import { Channel, Message, Profil, Status, User } from "./types/user.type"
import { sendWrapper, sortFriendList } from "./utils"
import { displayWhatever } from "../layout/main.layout"
import { GameOption } from "../pages/game/customGame"

export type Conv = {
	id: string | undefined,
	friendOrConvId: string,
	messages: Message[],
	profil?: Profil | Channel
}

export type ContextUser = {
	user: User | undefined
	isConnected: boolean
	isSimpleConnected: boolean
	friendList: Profil[]
	isLoaded: boolean,
	convList: Conv[],
	channelList: Channel[],
	activeConv: Conv | undefined,
	updateUser: () => Promise<any>,
	updateFriendList: () => void,
	updateChannelList: () => void,
	setConvList: React.Dispatch<React.SetStateAction<Conv[]>>,
	setActiveConv: React.Dispatch<React.SetStateAction<Conv | undefined>>,
	setUser: React.Dispatch<React.SetStateAction<User | undefined>>,
	setIsConnected: React.Dispatch<React.SetStateAction<boolean>>,
	setIsSimpleConnected: React.Dispatch<React.SetStateAction<boolean>>,
	setIsLoaded: React.Dispatch<React.SetStateAction<boolean>>,
	addMsgToConvList: (msg: Message, error?: boolean) => void
}

const defaultContext: ContextUser =
{
	user: undefined,
	friendList: [],
	isConnected: false,
	isLoaded: false,
	convList: [],
	channelList: [],
	activeConv: undefined,
	isSimpleConnected: false,
	updateUser: async () => Promise,
	updateFriendList: async () => Promise,
	updateChannelList: async () => Promise,
	setIsConnected: () => void 0,
	setIsLoaded: () => void 0,
	setUser: () => void 0,
	setConvList: () => void 0,
	addMsgToConvList: () => void 0,
	setActiveConv: () => void 0,
	setIsSimpleConnected: () => void 0
}

export const UserContext = React.createContext<ContextUser>(defaultContext)

interface Props
{
	children: React.ReactNode
}

const UserProvider: React.FC<Props> = ({ children }) =>
{
	const [user, setUser] = useState<User | undefined>(undefined)
	const [isConnected, setIsConnected] = useState<boolean>(true)
	const [friendList, setFriendList] = useState<Profil[]>([])
	const [isLoaded, setIsLoaded] = useState(false)
	const [convList, setConvList] = useState<Conv[]>([])
	const [channelList, setChannelList] = useState<Channel[]>([])
	const [activeConv, setActiveConv] = useState<Conv | undefined>(undefined)
	const [isSimpleConnected, setIsSimpleConnected] = useState<boolean>(true)


	const updateChannelList = React.useCallback(async () =>
	{
		if (!isConnected || !user)
			return
		await sendWrapper("get", "/channel/get-channels",
			(res) =>
			{
				if (!user)
					return
				const chanLst = res?.data
				setChannelList(chanLst)
			}, () => void 0)
		return "updated"
		// eslint-disable-next-line
	}, [user])


	useEffect(() =>
	{
		updateChannelList()
		// eslint-disable-next-line
	}, [user?.channels])

	useEffect(() =>
	{
		channelList.forEach((channel) =>
		{
			if (!isSocketOn(socketChannel, `${channel.id}`))
			{
				socketChannel.on(`${channel.id}`, () =>
				{
					updateChannelList()
				})
			}
			if (!isSocketOn(socketChannel, `message on ${channel.id}`))
			{
				socketChannel.on(`message on ${channel.id}`, (newMessage: Message) =>
				{
					const chanIdx = channelList.findIndex(chan => channel.id === chan.id)
					if (chanIdx < 0)
						updateChannelList()
					else
					{
						const channelListCpy = channelList.slice()
						channelListCpy[chanIdx].conv.push(newMessage)
						setChannelList(channelListCpy)

					}

				})
			}
		})
		// eslint-disable-next-line
	}, [channelList])


	const updateFriendList = React.useCallback(async () =>
	{
		if (!isConnected || !user)
			return
		await sendWrapper("get", "/social/get-profils-friend-list",
			(res) =>
			{
				if (!user)
					return
				const friendLst = res?.data
				setFriendList(sortFriendList(friendLst, user))
			}, () => void 0)
		return "updated"
	}, [user, isConnected])


	useEffect(() =>
	{
		updateFriendList()
		// eslint-disable-next-line
	}, [user?.friendList])


	useEffect(() =>
	{
		if (!isConnected)
			return
		if (user?.id)
		{
			if (!isSocketOn(socketStatus, user.id))
			{
				socketStatus.on(`${user.id}`, (newStatus: Status) =>
				{
					setUser((current) => (current ? { ...current, profil: { ...current?.profil, status: newStatus } } : current))
				})
			}

			if (!isSocketOn(socketFriend, user.id))
			{
				socketFriend.on(`${user.id}`, () =>
				{
					updateUser()
				})
			}
			if (!isSocketOn(socketFriend, `invitePlay${user.id}`))
			{
				socketFriend.on(`invitePlay${user.id}`, async (data: { adversaire: Profil, gameId: string, customVar?: GameOption }) =>
				{
					displayWhatever(<DefyPopup adversaire={data.adversaire} gameId={data.gameId} customVar={data.customVar} />)
					await new Promise(f => setTimeout(f, 20000))
					socketFriend.emit("refuseGame", data.gameId, () => displayWhatever(<div id='whatever' />))
				})
			}

			if (!isSocketOn(socketStatus, `error ${user.id}`))
			{
				socketStatus.on(`error ${user.id}`, (error: "not authenticated") =>
				{
					if (error === 'not authenticated')
						logout(setIsConnected)
				})
			}
		}

	}, [user?.id, isConnected])


	useEffect(() =>
	{
		if (!isConnected)
			return

		let convListTmp1: Conv[] = []
		let convListTmp2: Conv[] = []

		if (user?.conv)
		{
			convListTmp1 = user.conv.map((elem) =>
			{
				return ({
					id: elem.id,
					friendOrConvId: elem.userId2 !== user.id ? elem.userId2 : elem.userInitId,
					messages: elem.message
				})
			})
		}

		if (user?.convInitiator)
		{
			convListTmp2 = user.convInitiator.map((elem) =>
			{
				return ({
					id: elem.id,
					friendOrConvId: elem.userId2 !== user.id ? elem.userId2 : elem.userInitId,
					messages: elem.message
				})
			}) || []
		}

		setConvList(convListTmp1.concat(convListTmp2))

	}, [user?.conv, user?.convInitiator, user?.id, isConnected])


	const addMsgToConvList = useCallback(async (msg: Message, error = false) =>
	{
		const convTmp = convList.slice()
		const convIdx = convList.findIndex((elem: Conv) => elem.id === msg.convId)
		if (convIdx === -1)
		{
			updateUser()
		}
		else
		{
			convTmp[convIdx].messages.push({ ...msg, error })
			setConvList(convTmp)
		}
	}, [convList])

	useEffect(() =>
	{
		if (!user)
			return

		friendList.forEach((friend, idx) =>
		{
			if (!isSocketOn(socketStatus, friend.userId))
				socketStatus.on(`${friend.userId}`, (newStatus: Status) =>
				{
					const newFriendList = [...friendList]
					newFriendList[idx].status = newStatus
					setFriendList(sortFriendList(newFriendList, user))
				})

			if (!isSocketOn(socketChat, friend.userId))
				socketChat.on(`${friend.userId}`, (reveiveddMessage: Message) =>
				{
					addMsgToConvList(reveiveddMessage, false)
				})
		})
		if (!friendList.find((friend) => friend.userId === activeConv?.friendOrConvId))
			setActiveConv(undefined)
		// eslint-disable-next-line
	}, [friendList])

	const updateUser = async () =>
	{
		sendWrapper("get", '/user/userBySession', (res) =>
		{
			if (res)
			{
				setUser(res.data.user)
			}
			setIsConnected(true)
		},
			() => setIsConnected(false))
		return "updated"
	}


	return (<UserContext.Provider

		value={{
			user,
			friendList,
			isConnected,
			isLoaded,
			convList,
			channelList,
			activeConv,
			isSimpleConnected,
			updateFriendList,
			updateChannelList,
			updateUser,
			setIsLoaded,
			setIsConnected,
			setUser,
			addMsgToConvList,
			setActiveConv,
			setConvList,
			setIsSimpleConnected
		}} >
		{children}
	</UserContext.Provider>
	)
}

export default UserProvider
