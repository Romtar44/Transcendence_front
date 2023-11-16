import { useContext, useEffect } from 'react';
import Home from "./pages/home/home"
import { Route, Routes, useLocation } from "react-router-dom"
import './App.css';
import { Profil } from './pages/profil/profil';
import { Social } from './pages/social/social';
import './global.scss'
import { SignIn } from './pages/signin/signin';
import { SignInPwd } from './pages/signin/signinPwd';
import { SignUp } from './pages/signup/signup';
import { checkSignin } from './lib/utils';
import { SignInGuard } from './component/signInGuard/signInGuard';
import axios from 'axios';
import { ChangePwd } from './pages/options/changePwd';
import { UserContext } from './lib/context';
import { Game } from './pages/game/game';
import { GameHome } from './pages/game/gameHome';
import { TwoFaAuth } from './pages/twoFaAuth/twoFaAuth';

function App()
{

	axios.defaults.withCredentials = true
	axios.defaults.headers.common['Access-Control-Allow-Origin'] = `http://localhost:3333`;

	const { user, updateUser, setIsLoaded, setIsConnected, isSimpleConnected, isConnected, isLoaded, setIsSimpleConnected } = useContext(UserContext);

	const location = useLocation()

	useEffect(() =>
	{
		setIsLoaded(false)
		checkSignin(updateUser, setIsConnected, setIsSimpleConnected, setIsLoaded, user)
		// eslint-disable-next-line
	}, [location.pathname])

	return (
		<Routes>
			<Route path="/" element={<SignInGuard element={<Home />} redir={!isConnected} redirTo='/signin' />} />
			<Route path="/profil" element={<SignInGuard element={<Profil />} redir={!isConnected} redirTo='/signin' />} />
			<Route path="/game/:id" element={<SignInGuard element={<Game />} redir={!isConnected} redirTo='/signin' />} />
			<Route path="/game/" element={<SignInGuard element={<GameHome />} redir={!isConnected} redirTo='/signin' />} />
			<Route path="/social" element={<SignInGuard element={<Social />} redir={!isConnected} redirTo='/signin' />} />
			<Route path="/changepwd" element={<SignInGuard element={<ChangePwd />} redir={!isConnected} redirTo='/signin' />} />

			<Route path="/signin" element={<SignInGuard element={<SignIn />} redir={isSimpleConnected} redirTo='/' />} />
			<Route path="/signinpwd" element={<SignInGuard element={<SignInPwd />} redir={isSimpleConnected} redirTo='/' />} />
			<Route path="/two-fa-authenticate" element={<SignInGuard element={<TwoFaAuth />} redir={!isSimpleConnected} redirTo='/signin' />} />

			<Route path="/signup" element={<SignInGuard element={<SignUp />} redir={isConnected} redirTo='/' />} />
		</Routes>
	);
}

export default App;
