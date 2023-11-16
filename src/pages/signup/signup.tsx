import { Button } from "../../component/button/button"
import { Input } from "../../component/input/input"
import { MagicBoxLayout } from "../../layout/magicBox.layout"
import styles from './signup.module.scss'
import logo42 from '../../asset/logo42.svg'
import Image from "../../component/image/image"
import { useContext, useEffect, useState } from "react"
import { sendWrapper } from "../../lib/utils"
import { useNavigate } from "react-router-dom"
import { AxiosResponse } from "axios"
import variables from "../../global.scss"
import { UserContext } from "../../lib/context"
import { updateStatusSocket } from "../../socket"

type SignupProps = {
}

export const SignUp: React.FC<SignupProps> = () =>
{
	const { setUser, setIsConnected, updateFriendList } = useContext(UserContext);

	const [isFormValid, setFormValid] = useState<Record<string, boolean>>({
		username: false,
		email: false,
		password: false,
		passconf: false,
	})

	const [inputValues, setInputValues] = useState<Record<string, string>>({
		username: "",
		email: "",
		password: "",
		passconf: "",
	})

	useEffect(() =>
	{
		setFormValid((prevValid) =>
			({ ...prevValid, passconf: inputValues.passconf === inputValues.password }))

	}, [inputValues.passconf, inputValues.password])

	const navig = useNavigate()

	const handleError = (error: any) =>
	{
		const message = error.response.data.message
		const alert = document.getElementById("alert") as HTMLDivElement
		alert.innerText = message

		if (message.includes("e-mail"))
			setFormValid((prev) => ({ ...prev, email: false }))
		if (message.includes("nom d'utilisateur"))
			setFormValid((prev) => ({ ...prev, username: false }))

	}

	const handleSuccess = (res?: AxiosResponse<any, any> | undefined,) =>
	{
		setUser(res?.data.user)
		updateFriendList()
		setIsConnected(true)
		updateStatusSocket()
		navig('/profil', { state: { goToAccount: true } })
	}

	return (
		<MagicBoxLayout>
			<div className={styles.signupContainer}>
				<div className={styles.title}>
					<h1>
						Créer votre compte
					</h1>
				</div>
				<form className={styles.signupForm} onSubmit={(e) =>
				{
					e.preventDefault()
					sendWrapper("put", "/user/newUser", handleSuccess, handleError, { email: inputValues.email, password: inputValues.password, username: inputValues.username })
				}}>

					<Input type='username' fontSize="16px" color="white" bgColor={variables.grenatcolor} border="1px solid white" placeHolder="Nom d'utilisateur"
						setValue={(input: string) => setInputValues((prevInputs) => ({ ...prevInputs, username: input }))}
						validate={(valid: boolean) => setFormValid((prevValid) => ({ ...prevValid, username: valid }))}
						isValid={isFormValid.username} />

					<Input type='email' fontSize="16px" color="white" bgColor={variables.grenatcolor} border="1px solid white" placeHolder="E-mail"
						setValue={(input: string) => setInputValues((prevInputs) => ({ ...prevInputs, email: input }))}
						validate={(valid: boolean) => setFormValid((prevValid) => ({ ...prevValid, email: valid }))}
						isValid={isFormValid.email} />

					<Input type='passwordType' fontSize="16px" color="white" bgColor={variables.grenatcolor} border="1px solid white" placeHolder="Mot de passe"
						setValue={(input: string) => setInputValues((prevInputs) => ({ ...prevInputs, password: input }))}
						validate={(valid: boolean) => setFormValid((prevValid) => ({ ...prevValid, password: valid }))}
						isValid={isFormValid.password} />

					<Input type='passwordConf' fontSize="16px" color="white" bgColor={variables.grenatcolor} border="1px solid white" placeHolder="Confirmer mot de passe"
						setValue={(input: string) => setInputValues((prevInputs) => ({ ...prevInputs, passconf: input }))}
						validate={(valid: boolean) => setFormValid((prevValid) => ({ ...prevValid, passconf: valid }))}
						isValid={isFormValid.passconf}
					/>

					<Button type="submit" disabled={Object.values(isFormValid).includes(false)} >
						<h3>S'inscrire</h3>
					</Button>
				</form>
				<div className={styles.errorAlert} id="alert" />
				<Button onClick={() =>
					window.location.href = (`${process.env.REACT_APP_PORTAL}`)
				}>
					<div className={styles.authButton42}>
						<Image imgSrc={logo42} alt="42 logo" w="25px"  ></Image>
						<span>S'inscrire avec 42auth</span>
					</div>
				</Button>


			</div>
		</MagicBoxLayout >
	)
}
