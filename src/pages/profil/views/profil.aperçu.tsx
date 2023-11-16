import React, { useContext, useEffect, useReducer, useState } from "react";
import styles from "./profil.views.module.scss"
import { sendWrapper } from "../../../lib/utils";
import Avatar from "../../../component/avatar/avatar";
import { UserContext } from "../../../lib/context";
import themes from '../../game/themes.module.scss'
import { Button } from "../../../component/button/button";
import { displayRequestStatus, displayWhatever } from "../../../layout/main.layout";
import { Input } from "../../../component/input/input";
import editIcon from "../../../asset/editIcon.svg"
import Image from "../../../component/image/image"
import { useNavigate } from "react-router-dom";
import { CheckBox } from "../../../component/checkBox/checkBox";
import { MyPopover } from "../../../component/popover/popover";
import { QrForm } from "../../../component/qrForm/qrForm";
import { BlockList } from "../../../component/socialManagement/socialManagement";

const FileUpload = () =>
{
	const { updateUser } = useContext(UserContext);
	const [value, setValue] = useState<File | null>(null)

	const handleError = (error: any) =>
	{
		setValue(null)
		const message = error.response.data.message
		const alert = document.getElementById("alert") as HTMLDivElement
		alert.innerText = message
	}

	return (
		<div className={styles.file_upload_container}>
			<input id="file_upload" type="file"
				accept="image/png, image/jpeg, image/jpg"
				className={styles.file_upload_default}
				onChange={(event) => setValue(event?.target.files ? event?.target?.files[0] : null)}
			/>

			<label
				className={styles.file_upload_custom}
				htmlFor={!value ? "file_upload" : ''}
				onClick={
					value ?
						(event) =>
						{
							const form = new FormData();
							form.append('file', value);
							sendWrapper("post", "/avatar/createAvatar", () =>
							{
								setValue(null)
								updateUser()
							}
								, handleError, form)
						}
						:
						() => void 0
				}>
				{
					!value ?
						<span>Modifier la photo de profil</span>
						:
						<span>Enregistrer</span>
				}
			</label>
			{
				value &&
				<span>{value.name}</span>
			}
			<div id="alert" style={{ display: value ? "none" : "block" }}></div>
		</div>)
}


export const colorTheme = ["black", "teal", "palevioletred", "mediumpurple", "firebrick", "darkolivegreen", "darkseagreen", "steelblue"]

export const ProfilAper: React.FC<{}> = () =>
{
	const { user, setUser } = useContext(UserContext);
	const [themeChoice, setThemeChoice] = useState(user?.theme || 0)
	const [themeChoiceColor, setThemeChoiceColor] = useState(user?.themeColor || "black")
	const [doubleAuth, setDoubleAuth] = useState<boolean>(user?.tfa ? user.tfa : false)

	const navigate = useNavigate()


	useEffect(() =>
	{
		if (user)
			setDoubleAuth(user.tfa)
	}, [user])

	function reducer(state: any, action: any)
	{
		switch (action.type)
		{
			case 'setEdit': {
				const stateCpy = { ...state }
				stateCpy[action.key].edit = true
				return stateCpy
			}
			case 'cancelEdit': {
				const stateCpy = { ...state }
				stateCpy[action.key].edit = false
				return stateCpy
			}
			case 'edit': {
				const stateCpy = { ...state }
				stateCpy[action.key].value = action.value
				return stateCpy
			}
			case 'validate': {
				const stateCpy = { ...state }
				stateCpy[action.key].isValid = action.isValid
				return stateCpy
			}
			case "reset": {
				const stateCpy = { ...state }
				stateCpy[action.key] = {
					edit: false,
					value: action.value,
					isValid: true
				}
				return stateCpy
			}
		}
	}



	const [inputs, handleInputs] = useReducer(reducer, {
		username: {
			edit: false,
			value: user?.profil?.userName,
			isValid: true
		},
		email: {
			edit: false,
			value: user?.email,
			isValid: true
		},
	})






	const changeUserName = () =>
	{
		sendWrapper('post', "/user/changeUsername",
			(res) =>
			{
				displayRequestStatus(true, "Nom d'utilisateur modifié")
				setUser(res?.data)
				handleInputs({ type: "reset", key: "username", value: res?.data.profil.userName })
			},
			(err) => displayRequestStatus(false, err.response.data.message, 5000),
			{ username: inputs.username.value })
	}

	const changeEmail = () =>
	{
		sendWrapper('post', "/user/changeEmail",
			(res) =>
			{
				displayRequestStatus(true, "Email modifié")
				setUser(res?.data)
				handleInputs({ type: "reset", key: "email", value: res?.data.email })
			},
			(err) => displayRequestStatus(false, err.response.data.message, 5000),
			{ email: inputs.email.value })
	}


	const changeTheme = () =>
	{
		sendWrapper("post", "/user/changeGametheme",
			(res) =>
			{
				setUser((prev) => (prev ? { ...prev, theme: themeChoice } : undefined))
				setUser(res?.data)
				displayRequestStatus(true, "Le theme du jeu a bien été mis a jour.")
			},
			() => displayRequestStatus(false, "Une erreure est survenue"),
			{ theme: themeChoice, color: themeChoiceColor }
		)
	}


	const turnOnTwoFa = () =>
	{
		displayWhatever(
			<MyPopover display={true} setDisplay={() =>
			{
				displayWhatever(undefined, true)
				setDoubleAuth(user?.tfa || false)
			}}
			>
				<div className={styles.qrCode}>
					<p >Scannez le code QR avec l'application Authenticator de Google</p>
					<div className={styles.QR}>
						<Image imgSrc={`${process.env.REACT_APP_BACK_URL}/tfa/generate-qr`} alt="Qr code" w="200px" h="200px" />
						<QrForm setDoubleAuth={(doubleAuth: boolean) =>
						{
							setUser((prev) => (prev ? { ...prev, tfa: doubleAuth } : undefined))
							setDoubleAuth(doubleAuth)
						}} action='update' navigator={navigate} />
					</div>
				</div>
			</MyPopover>
		)
	}

	const turnOffTwoFa = () =>
	{
		sendWrapper("post", "/tfa/turn-of-2fa",
			(res) =>
			{
				displayRequestStatus(true, "Authentification à deux facteur désactivée")
				setUser(res?.data)
				setDoubleAuth(false)
			},
			() =>
			{
				displayRequestStatus(false, "Une erreur est survenue")
			})
	}


	const nav = useNavigate()



	return (
		<div className={styles.container}>
			<h2>Mon compte</h2>
			<div className={styles.avatar} >
				<Avatar size="180px" id={user?.profil.avatarId.toString()} />
				<FileUpload />
			</div>
			<div className={styles.parameters}>
				<div>
					<label>Nom d'utilisateur</label>
					<div>
						<Input
							className={styles.inputparam}
							type='username'
							setValue={(value) => handleInputs({ type: "edit", key: 'username', value: value })}
							value={inputs.username.edit ? inputs.username.value : user?.profil.userName}
							disabled={!inputs.username.edit}
							validate={(isValid) => handleInputs({ type: "validate", key: "username", isValid: isValid })}
						/>
						{
							!inputs.username.edit ?
								<div className={styles.editIcon} onClick={() => handleInputs({ type: "setEdit", key: "username" })}>
									<Image alt='Modifier' imgSrc={editIcon} />
								</div>
								:
								<div className={styles.editIcon} onClick={() => handleInputs({ type: "cancelEdit", key: "username" })}>
									<span className={styles.cancelIcon}>&#10006;</span>
								</div>
						}
						{
							(inputs.username.edit && inputs.username.isValid) &&
							<span className={styles.validIcon} onClick={changeUserName}>&#10004;</span>
						}
					</div>
				</div>
				<div>
					<label>Email</label>
					<div>
						<Input
							className={styles.inputparam}
							type='email'
							setValue={(value) => handleInputs({ type: "edit", key: 'email', value: value })}
							value={inputs.email.edit ? inputs.email.value : user?.email}
							disabled={!inputs.email.edit}
							validate={(isValid) => handleInputs({ type: "validate", key: "email", isValid: isValid })}
						/>
						{
							!inputs.email.edit ?
								<div className={styles.editIcon} onClick={() => handleInputs({ type: "setEdit", key: "email" })}>
									<Image alt='Modifier' imgSrc={editIcon} />
								</div>
								:
								<div className={styles.cancelIcon} onClick={() => handleInputs({ type: "cancelEdit", key: "email" })}>
									<span className={styles.editIcon}>&#10006;</span>
								</div>
						}
						{
							(inputs.email.edit && inputs.email.isValid) &&
							<span className={styles.validIcon} onClick={changeEmail}>&#10004;</span>
						}
					</div>

				</div>

				<div>
					<label>Mot de passe</label>
					<div>
						<Input
							className={styles.inputparam}
							type='passwordType'
							value={"********"}
							setValue={() => void 0}
							disabled={!inputs.email.edit}
						/>
						<div className={styles.editIcon} onClick={() => nav("/changepwd")}>
							<Image alt='Modifier' imgSrc={editIcon} />
						</div>
					</div>
				</div>
				<div>
					<label>Authentification à deux facteur</label>
					<CheckBox id="1" setState={setDoubleAuth} state={doubleAuth}
						onChange={() =>
						{
							if (!doubleAuth)
								turnOnTwoFa()
							else
								turnOffTwoFa()
						}} />

				</div>
				<div>
					<label>Liste des utilisateurs bloqués</label>
					<BlockList w="30px" />
				</div>
			</div>
			<div className={styles.themeOption}>
				<h3>Choix du thème du jeux</h3>
				<div>
					<button className={styles.flecheL + " " + styles.fleche} disabled={themeChoice === 0}
						onClick={() => setThemeChoice(prev => prev - 1)}></button>
					<div style={{ "--bgTheme": themeChoiceColor } as React.CSSProperties}
						className={`${themes[`theme${themeChoice}`]} ${styles.themeApercu}`}></div>
					<button className={styles.flecheR + " " + styles.fleche} disabled={themeChoice === 6}
						onClick={() => setThemeChoice(prev => prev + 1)}></button>
				</div>
				<div>
					<button className={styles.flecheL + " " + styles.fleche} disabled={colorTheme.indexOf(themeChoiceColor) === 0}
						onClick={() => setThemeChoiceColor(prev => colorTheme[colorTheme.indexOf(prev) - 1])}></button>
					<div style={{ "--color": themeChoiceColor } as React.CSSProperties} className={styles.colorChoice}></div>
					<button className={styles.flecheR + " " + styles.fleche} disabled={colorTheme.indexOf(themeChoiceColor) === colorTheme.length - 1}
						onClick={() => setThemeChoiceColor(prev => colorTheme[colorTheme.indexOf(prev) + 1])}></button>
				</div>
				{
					(themeChoice !== user?.theme || themeChoiceColor !== user?.themeColor) &&
					<Button className={styles.validButton} onClick={changeTheme}><span>Valider</span></Button>
				}
			</div>
		</div>
	)
}
