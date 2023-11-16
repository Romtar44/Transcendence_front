export type Message = {
	id: string,
	senderId: string,
	content: string,
	timeStamp: Date,
	convId:	string,
	channelId: string,
	error?: boolean
	seen?: boolean
}

export type Convervsation = {
	id: string,
	message: Message[],
	userInitId: string,
	userId2: string
}

export type Channel = {
	id: string,
	conv: Message[],
	status: "PUBLIC" | "PRIVATE" | "PROTECTED",
	adminId: string[],
	ownerId: string,
	memberId: string[],
	channelName: string,
	avatarId: number,
	banList: string[],
	mutedList: string[]
	invitedList: string[]
}

export type Muted = {
	id: string,
	userId: string,
	timeStart: Date,
	timeEnd: Date,
	channelId: string
}

export type Friend = {
	id: string,
	friendUserId: string,
	userId: string,
	accepted: boolean
}

export type Stats = {
	id: string,
	win: number,
	lose: number,
	draw: number,
	rank: "🪙 Débutant 🪙" | "🥉 Amateur 🥉" | "🥈 Confirmé 🥈" | "🥇 Expert 🥇" | "🏅 Maître 🏅",
	level: number,
	xp: number,
	percentXp: number,
}

export type Match = {
	id: string,
	p1Score: number,
	p2Score: number,
	players: Profil[],
	mode: string,
	timeStamp: Date,
	gaveUp?: "player1" | "player2"


}

export type Status = "ONLINE" | "OFFLINE" | "PLAYING" | "AWAY"

export type Profil = {
	id: string,
	userName: string,
	status: Status,
	stats: Stats,
	avatarId: number,
	userId: string,
	matchHistory: Match[]
}


export type User = {
	id: string,
	email: string,
	tfa: boolean,
	profil: Profil,
	friendList: Friend[],
	pendingList: string[],
	blockList: string[],
	channels: Channel[],
	channelPendingList: string[],
	channelsOwn: Channel[],
	convInitiator: Convervsation[],
	conv: Convervsation[]
	theme: number,
	themeColor: string
}


export type PartialUser = {
	id: string,
	profil: Profil,
	friendList: Friend[],
	pendingList: string[],
	blockList: string[],
	channels: Channel[],
	channelsOwn: Channel[],
	convInitiator: Convervsation[],
	conv: Convervsation[]
}
