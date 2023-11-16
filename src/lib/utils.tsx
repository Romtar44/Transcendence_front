import axios, { AxiosResponse } from "axios";
import Cookies from "js-cookie";
import {Profil, User } from "./types/user.type";
import { socketFriend } from "../socket";
import { displayRequestStatus, displayWhatever } from "../layout/main.layout";
import { NavigateFunction } from "react-router-dom";
import React from "react";
import { GameOption } from "../pages/game/customGame";
import { LoaderAwait } from "../component/loader/loader";
import { Button } from "../component/button/button";

type Method = "get" | "put" | "post" | "delete"

export class Debounce {
	timeoutID: unknown

	execute = (fn: () => void, ms: number) =>
	{
		if (typeof this.timeoutID === "number")
			clearTimeout(this.timeoutID)
		this.timeoutID = setTimeout(() => fn(), ms)
	}
}

export const sendWrapper = async (
	method: Method,
	path: string,
	onSuccess: (res?: AxiosResponse<any, any>) => void,
	onError: (error?: any) => void,
	body?: Object) =>
{
	await axios[method](`${process.env.REACT_APP_BACK_URL}${path}`, body)
		.then((response) =>
		{
			onSuccess(response)
		})
		.catch((error) =>
		{
			if (window.location.pathname !== "/signin" && window.location.pathname !== "/two-fa-authenticate" && window.location.pathname !== "/signup" && window.location.pathname !== "/signinpwd" &&
				error.response && (error.response.status === 401 || error.response.status === 403))
				window.location.href = '/signin'
			else
				onError(error)
		})
		return 'ok'
}

export const checkSignin = async (updateUser: () => Promise<any>,
			setConnected: React.Dispatch<React.SetStateAction<boolean>>,
			setSimpleConnected : React.Dispatch<React.SetStateAction<boolean>>,
			setIsLoaded: React.Dispatch<React.SetStateAction<boolean>>,
			user?: User) =>
{

	const token = Cookies.get("access_token")
	setIsLoaded(false)

	if (token)
	{
		await sendWrapper("get", "/auth/issignin", async (res) =>
		{
			if (!user)
			{
				await updateUser()
			}

			setConnected(true)
		},
		() => {
			setConnected(false)
			sendWrapper("get", "/auth/isSimpleSignin", async (res) =>
			{

				setSimpleConnected(true)
			},
			() => {
				setSimpleConnected(false)
			})
		})
		.then(() => setIsLoaded(true));
	}
	else
	{
		setSimpleConnected(false)
		setConnected(false)
		setIsLoaded(true)
	}
}


export const isUserInPending = (friendProfil: Profil, user: User) =>
{
	const friend = user.friendList.find((elem) => elem.friendUserId === friendProfil.userId)
	if (friend)
	{
		if (friend.accepted === true)
			return false

		return true
	}

	return false
}

export const sortFriendList = (friendList: Profil[], user: User) =>
{
	const sort = friendList.sort((friend1, friend2) =>
	{

		if (user.id && isUserInPending(friend1, user))
			{

				return 1}
		if (user.id &&  isUserInPending(friend2, user))
			{
				return -1}
		if (friend1.status === "ONLINE")
		{
			return -1
		}
		if (friend1.status === "OFFLINE")
			return 1
		if (friend1.status === "PLAYING")
		{
			if (friend2.status !== "ONLINE")
				return -1
			return 1
		}
		if (friend1.status === "AWAY")
		{
			if(friend2.status !== "OFFLINE")
				return 1
			return -1
		}
		return 0
	})
	return sort
}


const awaitAccept = (navigate: NavigateFunction, res: any, loader: React.ReactNode, profil?: Profil) =>
{

	socketFriend.on(`accept${res.data.id}`, () =>
	{
		navigate(`/game/${res.data.id}`)
		displayRequestStatus(true, `${profil?.userName} a accepté votre demande de jeux.`, 7000)
		socketFriend.off(`accept${res.data.id}`)
		socketFriend.off(`refused${res.data.id}`)
		displayWhatever(undefined, true)
	})
	const cancelInvite = (res: any)=> {
		socketFriend.emit("refuseGame", res.data.id)
		socketFriend.off(`accept${res.data.id}`)
		socketFriend.off(`refused${res.data.id}`)
		displayWhatever(undefined, true)

	}
	const loaderAwait = (
			<LoaderAwait username={`${profil?.userName}`} cancel={()=>cancelInvite(res)} />
	)
	displayWhatever(loaderAwait)
	socketFriend.on(`refused${res.data.id}`, () =>
	{
		socketFriend.off(`accept${res.data.id}`)
		socketFriend.off(`refused${res.data.id}`)
		displayRequestStatus(false, `${profil?.userName} n'a pas accepté votre demande de jeux.`, 7000)
		displayWhatever(undefined, true)

	})

}
export const invitePlay = async (navigate: NavigateFunction, loader: React.ReactNode, profil?: Profil, gameVar?: GameOption,) =>
{
	sendWrapper("put", "/game/defy", (res) => awaitAccept(navigate, res, loader, profil), () => void 0, { adversaireId: profil?.userId, custom: gameVar? true : false, ...gameVar })
}





