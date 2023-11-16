import styles from './signin.module.scss'
import { MagicBoxLayout } from '../../layout/magicBox.layout'
import { Input } from '../../component/input/input'
import { useContext, useState } from 'react'
import { Button } from '../../component/button/button'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { SignIn } from './signin'
import { sendWrapper } from "../../lib/utils"
import { AxiosResponse } from 'axios'
import variables from "../../global.scss"
import { UserContext } from '../../lib/context'
import { updateStatusSocket } from '../../socket'

export const SignInPwd = () =>
{
	const { setUser, setIsConnected, setIsSimpleConnected, updateFriendList } = useContext(UserContext);
	const navig = useNavigate()
	const [isPasswordValid, setPasswordValid] = useState(true)

	const [passValue, setPassValue] = useState("")
	const [searchParams] = useSearchParams();
	const email = searchParams.get("email")

	const handleSuccess = (res?: AxiosResponse<any, any> | undefined,) =>
	{

		if (!res?.data.tfa)
		{
			setUser({ ...res?.data.user })
			updateFriendList()
			setIsConnected(true)
			updateStatusSocket()
			navig('/')
		}
		else
		{
			setIsSimpleConnected(true)
			navig('/two-fa-authenticate')
		}

	}

	const handleError = (error: any) =>
	{
		const message = error.response.data.message
		const alert = document.getElementById("alert") as HTMLDivElement

		alert.innerText = message

		if (message.includes("de passe"))
			setPasswordValid(false)
	}

	if (!email)
	{
		window.location.replace("/signin")
		return <SignIn />
	}

	return (
		<MagicBoxLayout crossDisplay={true}>
			<div className={styles.signinContainer}>
				<h1>Entrez votre mot de passe</h1>
				<Input type='text' bgColor='grey' defaultValue={email} setValue={() => void 0} disabled={true} />

				<form className={styles.passwordForm} onSubmit={(e) =>
				{
					e.preventDefault()
					sendWrapper("post", "/auth/login",
						handleSuccess, handleError, { email, password: passValue })
				}}>
					<Input type='password'
						fontSize='16px'
						color='white'
						bgColor={variables.grenatcolor}
						border='1px solid white'
						placeHolder='Mot de passe'
						setValue={setPassValue}
						hideHint={true}
						isValid={isPasswordValid}
						validate={void 0}
					/>
					<a href="/signup">Mot de passe oublié ?</a>
					<Button type='submit' disabled={passValue.length < 8} >
						<b>Se connecter</b>
					</Button>
					<div className={styles.errorAlert} id="alert" />
				</form>

			</div>
		</MagicBoxLayout >
	)
}
