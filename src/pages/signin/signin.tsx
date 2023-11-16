import { useState } from 'react'
import styles from './signin.module.scss'
import { MagicBoxLayout } from '../../layout/magicBox.layout'
import { Button } from '../../component/button/button'
import Image from "../../component/image/image"
import logo42 from '../../asset/logo42.svg'
import { Input } from '../../component/input/input'
import { useNavigate } from 'react-router-dom'
import { sendWrapper } from '../../lib/utils'
import variables from "../../global.scss"

export const SignIn = () =>
{
	const [isFormValid, setFormValid] = useState(false)

	const [emailValue, setEmail] = useState("")

	const navig = useNavigate()

	const handleError = (error: any) =>
	{
		const message = error.response.data.message
		const alert = document.getElementById("alert") as HTMLDivElement
		alert.innerText = message
		if (error.response.status === 404)
		{
			setFormValid(false)
		}
	}

	return (
		<MagicBoxLayout crossDisplay={false}>
			<div className={styles.signinContainer}>

				<h1 className={styles.title}>
					<span className={styles.welcome}>BIENVENUE SUR</span>
					<br />
					<span className={styles.logo}>PONG</span>
				</h1>

				<Button onClick={() =>
					window.location.href = (`${process.env.REACT_APP_PORTAL}`)
				}>
					<div className={styles.authButton42}>
						<Image imgSrc={logo42} alt="42 logo" w="20px" h="auto"  ></Image>
						<span>Se connecter avec 42auth</span>
					</div>
				</Button>
				<div className={styles.delimitor} >
					<div />
					<b>OU</b>
					<div />
				</div>
				<form className={styles.emailForm} onSubmit={(event) =>
				{
					event.preventDefault()
					sendWrapper("get", `/user/getUserByEmail/${emailValue}`,
						() => navig(`/signinpwd?email=${emailValue}`), handleError)
				}}>
					<div>
						<Input type='email' fontSize='16px' color='white' bgColor={variables.grenatcolor} border='1px solid white' placeHolder='E-mail' validate={setFormValid} setValue={setEmail} isValid={isFormValid} hideHint={true} />
						<div className={styles.errorAlert} id="alert" />
					</div>
					<Button type='submit' disabled={!isFormValid}>
						<b>Suivant</b>
					</Button>
				</form>
				<p className={styles.signUp}>
					<span>Vous n'avez pas de compte ? </span>
					<a href='/signup'>Inscrivez-vous</a>
				</p>
			</div>
		</MagicBoxLayout >
	)
}
