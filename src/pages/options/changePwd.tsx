import { useContext, useEffect, useState } from "react"
import { Input } from "../../component/input/input"
import { MagicBoxLayout } from "../../layout/magicBox.layout"
import { Button } from "../../component/button/button"
import styles from "./changePwd.module.scss"
import { sendWrapper } from "../../lib/utils"
import { useNavigate } from "react-router-dom"
import variables from "../../global.scss"
import { ChevronLeftIcon } from '@chakra-ui/icons'
import { displayRequestStatus } from "../../layout/main.layout"
import { logout } from "../../component/logoutButton/logoutButton"
import { UserContext } from "../../lib/context"

export const ChangePwd = () =>
{
	const { setIsConnected } = useContext(UserContext)

	const [isFormValid, setFormValid] = useState<Record<string, boolean>>({
		oldpassword: false,
		password: false,
		passconf: false,
	})

	const [inputValues, setInputValues] = useState<Record<string, string>>({
		oldpassword: "",
		password: "",
		passconf: "",
	})


	const navig = useNavigate()
	useEffect(() =>
	{
		setFormValid((prevValid) =>
			({ ...prevValid, passconf: inputValues.passconf === inputValues.password }))

	}, [inputValues.passconf, inputValues.password])


	const alert = document.getElementById("alertT")

	useEffect(() =>
	{
		if (isFormValid.password && inputValues.password === inputValues.oldpassword)
		{
			setFormValid((prevValid) =>
				({ ...prevValid, password: false }))
			if (alert)
				alert.textContent = "Le nouveau mot de passe doit être different de l'ancien"

		}
		else if (alert)
		{
			alert.textContent = ""
		}
		// eslint-disable-next-line
	}, [inputValues.oldpassword, inputValues.password])


	const handleError = (error: any) =>
	{
		displayRequestStatus(false, error.response.data.message, 5000)
		setFormValid((prevValid) => ({ ...prevValid, oldpassword: false }))
	}

	const handleSuccess = () =>
	{
		logout(setIsConnected)
		displayRequestStatus(true, "Mot de passe modifié, merci de vous reconnecter", 5000)
	}

	return (
		<MagicBoxLayout crossDisplay={false}>
			<div className={styles.changePwdContainer}>
				<Button className={styles.backIcon} color='white' bgColor='transparent' border='1px solid white' variant='rounded' onClick={() => navig("/profil")}>
					<ChevronLeftIcon margin={'auto'} />
				</Button>
				<form className={styles.changePwd} onSubmit={(e) =>
				{
					e.preventDefault()
					sendWrapper("post", "/user/changepwd", handleSuccess, handleError, { password: inputValues.password, oldPassword: inputValues.oldpassword })
				}}>
					<h1>Changer de mot de passe</h1>
					<Input type='passwordType' fontSize="16px" color="white" bgColor={variables.grenatcolor} border="1px solid white" placeHolder="Ancien mot de passe"
						setValue={(input: string) => setInputValues((prevInputs) => ({ ...prevInputs, oldpassword: input }))}
						hideHint={true}
						validate={(valid: boolean) => setFormValid((prevValid) => ({ ...prevValid, oldpassword: valid }))}
						isValid={isFormValid.oldpassword}
					/>
					<div className={styles.errorAlert} id="alert" />

					<Input type='passwordType' fontSize="16px" color="white" bgColor={variables.grenatcolor} border="1px solid white" placeHolder="Mot de passe"
						setValue={(input: string) => setInputValues((prevInputs) => ({ ...prevInputs, password: input }))}
						validate={(valid: boolean) => setFormValid((prevValid) => ({ ...prevValid, password: valid }))}
						isValid={isFormValid.password}
						hideHint={inputValues.password === inputValues.oldpassword} />
					<div className={styles.errorAlert} id='alertT' />

					<Input type='passwordConf' fontSize="16px" color="white" bgColor={variables.grenatcolor} border="1px solid white" placeHolder="Confirmer mot de passe"
						setValue={(input: string) => setInputValues((prevInputs) => ({ ...prevInputs, passconf: input }))}
						validate={(valid: boolean) => setFormValid((prevValid) => ({ ...prevValid, passconf: valid }))}
						isValid={isFormValid.passconf} />
					<div className={styles.errorAlert} id="alert" />

					<Button type="submit" disabled={Object.values(isFormValid).includes(false)}>
						<b>Confirmer</b>
					</Button>
				</form>
			</div>
		</MagicBoxLayout>)
}
