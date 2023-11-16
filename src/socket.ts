	import Cookies from 'js-cookie';
	import { io, Socket } from 'socket.io-client';
	import { logout } from './component/logoutButton/logoutButton';
	import { socketGame } from './pages/game/game';

	export let socketChat = io(`${process.env.REACT_APP_BACK_URL}/chat` || "", {
		auth: {
			access_token: Cookies.get('access_token')}
	});

	export let socketStatus = io(`${process.env.REACT_APP_BACK_URL}/status` || "", {
		auth: {
			access_token: Cookies.get('access_token')}
	});

	export let socketFriend = io(`${process.env.REACT_APP_BACK_URL}/friend` || "", {
		auth: {
			access_token: Cookies.get('access_token')}
	});

	export let socketChannel = io(`${process.env.REACT_APP_BACK_URL}/channel` || "", {
		auth: {
			access_token: Cookies.get('access_token')}
	});



	let socketError = io(`${process.env.REACT_APP_BACK_URL}/error` || "", {

	});
	socketError.on('connect', () => {
		socketError.on(`${socketError.id} disconnect`,() => logout())

	 });






	export const isSocketOn = (socket: Socket, event: string ) =>
	{
		if ((socket as any)._callbacks)
		{
			const callbacks = Object.keys((socket as any)._callbacks)
			return callbacks.includes(`$${event}`)
		}
		return false
	}



	export const updateStatusSocket = () =>
	{
		disconectSocket()
		socketStatus = io(`${process.env.REACT_APP_BACK_URL}/status` || "", {
			auth: {
				access_token: Cookies.get('access_token')
			}});

		socketChat = io(`${process.env.REACT_APP_BACK_URL}/chat` || "", {
			auth: {
				access_token: Cookies.get('access_token')
			}});

		socketFriend = io(`${process.env.REACT_APP_BACK_URL}/friend` || "", {
			auth: {
				access_token: Cookies.get('access_token')
			}});

		socketChannel = io(`${process.env.REACT_APP_BACK_URL}/channel` || "", {
			auth: {
				access_token: Cookies.get('access_token')
			}});

	}


	export const  disconectSocket = () =>
	{
		socketStatus.disconnect()
		socketChat.disconnect()
		socketFriend.disconnect()
		socketGame.disconnect()
		socketChannel.disconnect()
	}
