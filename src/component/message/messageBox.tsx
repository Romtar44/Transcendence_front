import React, { useEffect, useLayoutEffect, useState } from "react";
import { useContext } from "react";
import { Conv, UserContext } from "../../lib/context";
import { Channel, Message, Profil } from "../../lib/types/user.type"
import { socketChannel, socketChat } from "../../socket";
import Image from '../../component/image/image'
import SendMessageLogo from '../../asset/sendIcon.svg'
import styles from './messageBox.module.scss'
import { isProfil } from "../../pages/social/social";
import { UserNameAndPP } from "../profilBox/profilBox";
import { sendWrapper } from "../../lib/utils";
import { MenuProfilActions } from "../actionPopover/actionPopoverProfil";

export const TextBox = ({
	friendOrConvId,
	isChannel,
	activeConv,
	setActiveConv }: {
		friendOrConvId: string,
		isChannel: boolean,
		activeConv: Conv,
		setActiveConv: (profil?: Profil | Channel) => void
	}) =>
{
	const { addMsgToConvList } = useContext(UserContext);
	const [inputValue, setInputValue] = useState("")

	const input = document.getElementById('messageInput') as HTMLInputElement

	useEffect(() =>
	{
		setInputValue('')
		if (input)
			input.value = ""
		// eslint-disable-next-line
	}, [activeConv])

	const sendMessage = () =>
	{
		if (inputValue === "")
			return

		if (!isChannel)
			socketChat.emit('sendMessage', { message: inputValue, receiverId: friendOrConvId }, (socketRes: any) =>
			{
				if (!isChannel)
				{
					if (socketRes.status === "success")
						addMsgToConvList(socketRes.msg, false)
					//else
					//	addMsgToConvList(socketRes.msg, true)
				}
				else if (!isProfil(activeConv.profil))
				{
					activeConv.profil?.conv.push(socketRes.msg)
					setActiveConv(activeConv.profil)
				}
			})
		else
		{
			socketChannel.emit('sendMessageChannel', { message: inputValue, channelId: friendOrConvId })
		}


		setInputValue("")
		if (input)
			input.value = ""
	}

	return (
		<div className={styles.textBoxContainer}>
			<input id='messageInput' className={styles.textBox}
				placeholder='Saisissez votre message ...'
				onKeyDown={(event) =>
				{
					if (event.key === "Enter")
						sendMessage()
				}}
				onChange={(event) =>
				{
					setInputValue(event.target.value)
				}} />
			<div className={styles.send} onClick={() => sendMessage()}>
				<Image imgSrc={SendMessageLogo} w="40px" h="40px" alt='Envoyer' />
			</div>
		</div>
	)
}

type MessageProps = {
	message: Message,
	channelOrProfil?: Profil | Channel,
	setActiveConv: (profil?: Profil | Channel) => void
	activeConv: Conv | undefined
	status?: "RECEIVED" | "LOADING" | "FAILED",
	prevSender?: string
}


const MessageBox: React.FC<MessageProps> = ({
	message,
	channelOrProfil,
	activeConv,
	setActiveConv,
	prevSender }) =>
{
	const { user } = useContext(UserContext);

	const messageReveived = message.senderId !== user?.id ? true : false
	const displayProfil = !messageReveived ? false : (prevSender === message.senderId || message.senderId === "bot" ? false : true)
	const [profil, setProfil] = useState(isProfil(channelOrProfil) ? channelOrProfil : undefined)

	if (messageReveived && displayProfil && !profil)
	{
		sendWrapper("get", `/profil/getProfil/${message.senderId}`,
			(res) =>
			{
				setProfil(res?.data)

			}, () => void 0)

	}


	if (!messageReveived || profil || !displayProfil)
	{
		return (
			<div className={`${styles.messageBoxContainer} ${!messageReveived ? styles.sent : styles.received} ${styles[message.senderId === "bot"? "bot" : ""]}`}>
				{profil && messageReveived && displayProfil &&
					<MenuProfilActions profil={profil} activeConv={activeConv}
						setActiveConv={setActiveConv} friendId={profil.id}
						isChannel={!isProfil(channelOrProfil)} channel={!isProfil(channelOrProfil) ? channelOrProfil : undefined}
						tooglePopover={<UserNameAndPP avatarSize={"45px"} profil={profil} withStatus={false} className={styles.senderProfil} />} />

				}
				<div className={`${styles.message}`} key={message.id}>
					<span>{message.content}</span>
				</div>


			</div>
		)
	}
	return <div>loading</div>
}



const MsgDate: React.FC<{ date: Date, printedDate: string[] }> = ({ date, printedDate }) =>
{
	const stringDate = new Date(date).toLocaleDateString("fr")

	return (
		<span className={styles.date}>{stringDate}</span>)

}

type MessgageThreadsProps = {
	activeConv: Conv,
	setActiveConv: (profil?: Profil | Channel) => void,
}

export const MessgageThreads: React.FC<MessgageThreadsProps> = ({
	activeConv,
	setActiveConv
}) =>
{
	const { convList } = useContext(UserContext);

	const [messages, setMessages] = useState<Message[]>(activeConv.messages)


	let printedDate: string[] = []

	useLayoutEffect(() =>
	{
		setMessages(activeConv.messages)


	}, [activeConv])


	useEffect(() =>
	{
		if (isProfil(activeConv.profil))
			var conv = convList.find((elem) => elem.id === activeConv.id)
		else
			conv = activeConv
		setMessages(conv?.messages || [])
	

	}, [convList, activeConv])

	useLayoutEffect(() =>
	{
		const messgageThreads = document.getElementById("messageThread");
		if (messgageThreads)
			messgageThreads.scrollTop = messgageThreads.scrollHeight + 1000
	}, [messages, activeConv, convList])

	return (
		<div className={styles.chatContainer}>
			<div className={styles.messageContainer} id='messageThread'>
				<ul className={styles.messageList}>
					{
						messages.map((msg, idx) =>
						{
							const toRender = <li key={msg.id + idx} >
								{msg.timeStamp && !printedDate.includes(new Date(msg.timeStamp).toLocaleDateString("fr"))
									&& <MsgDate date={msg.timeStamp} printedDate={printedDate} />}
								<MessageBox message={msg} status='RECEIVED' channelOrProfil={activeConv.profil} activeConv={activeConv} setActiveConv={setActiveConv} prevSender={idx > 0 ? messages[idx - 1].senderId : undefined} />
							</li>
							printedDate.push(new Date(msg.timeStamp).toLocaleDateString("fr"))
							return toRender
						})}
				</ul>
			</div>
			<TextBox friendOrConvId={activeConv.friendOrConvId}
				isChannel={!isProfil(activeConv.profil)}
				activeConv={activeConv} setActiveConv={setActiveConv} />
		</div>
	)

}
