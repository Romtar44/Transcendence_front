import React, { useContext, useEffect, useState } from "react"
import styles from './createChannel.module.scss'
import { MyPopover } from "../../popover/popover"
import { Button } from "../../button/button"
import { Input } from "../../input/input"
import { sendWrapper } from "../../../lib/utils"
import { UserContext } from "../../../lib/context"
import variables from "../../../global.scss"
import { displayRequestStatus } from "../../../layout/main.layout"

type CreateChannelProps = {
	createMode: boolean,
	setMode: React.Dispatch<React.SetStateAction<boolean>>
}

export const CreateChannel: React.FC<CreateChannelProps> = ({
	createMode,
	setMode
}) =>
{
	const [pubOrPrivOrProt, setPubOrPrivOrProt] = useState<string>("PUBLIC")
	const { updateChannelList } = useContext(UserContext)

	const [isFormValid, setFormValid] = useState<Record<string, boolean>>({
		chanName: false,
		password: false,
		passconf: false,
	})

	const [inputValues, setInputValues] = useState<Record<string, string>>({
		chanName: "",
		password: "",
		passconf: "",
	})

	useEffect(() =>
	{
		setFormValid((prevValid) =>
			({ ...prevValid, passconf: inputValues.passconf === inputValues.password }))

	}, [inputValues.passconf, inputValues.password])


	const handleSuccess = () =>
	{
		updateChannelList()
		setMode(false)
		displayRequestStatus(true, "Le salon a bien été créé")
	}

	const handleError = (error: any) =>
	{
		const message = error.response.data.message
		const alert = document.getElementById("alert") as HTMLDivElement
		alert.innerText = message

		setFormValid((prev) => ({ ...prev, chanName: false }))

		displayRequestStatus(false, "Une erreur est survenue dans la création du salon")
	}

	return (
		<MyPopover w="max(30%, 280px)" display={createMode} setDisplay={setMode}>
			<div className={styles.channelCreationContainer}>
				<h2>
					Créer un nouveau salon
				</h2>
				<div className={styles.channelTypeContainer}>
					<Button onClick={() => setPubOrPrivOrProt("PUBLIC")}
						bgColor={pubOrPrivOrProt === "PUBLIC" ? "white" : "grey"}
						variant="squared"
					>
						<span>
							Salon public
						</span>
					</Button>
					<Button onClick={() => setPubOrPrivOrProt("PRIVATE")}
						bgColor={pubOrPrivOrProt === "PRIVATE" ? "white" : "grey"}
						variant="squared"
					>
						<span>
							Salon privé
						</span>
					</Button>
					<Button onClick={() => setPubOrPrivOrProt("PROTECTED")}
						bgColor={pubOrPrivOrProt === "PROTECTED" ? "white" : "grey"}
						variant="squared"
					>
						<span>
							Salon protégé
						</span>
					</Button>
				</div>
				<div className={styles.channelHintContainer}>
					{
						pubOrPrivOrProt === "PUBLIC" && <span>Ce salon sera accessible et visible par tous</span>
					}
					{
						pubOrPrivOrProt === "PRIVATE" && <span>Ce salon ne sera pas visible et accessible uniquement sous invitation</span>
					}
					{
						pubOrPrivOrProt === "PROTECTED" && <span>Ce salon sera visible par tous mais protégé par un mot de passe</span>
					}
				</div>
				<form onSubmit={(e) =>
				{
					e.preventDefault()
					sendWrapper("put", "/channel/newChannel", handleSuccess, handleError, { type: pubOrPrivOrProt, channelName: inputValues.chanName, password: pubOrPrivOrProt === "PROTECTED" ? inputValues.password : undefined })
				}}
					className={styles.channelInputContainer}>
					<Input type="username" fontSize="16px" color="white"
						placeHolder="Nom du salon" border="1px solid white"
						bgColor={variables.sociallightcolor}
						setValue={(input: string) => setInputValues((prevInputs) => ({ ...prevInputs, chanName: input }))}
						validate={(valid: boolean) => setFormValid((prevValid) => ({ ...prevValid, chanName: valid }))}
						isValid={isFormValid.chanName} />
					{
						pubOrPrivOrProt === "PROTECTED" &&
						<div className={styles.channelPasswordContainer}>
							<Input type='passwordType' fontSize="16px" color="white"
								bgColor={variables.sociallightcolor}
								border="1px solid white" placeHolder="Mot de passe"
								setValue={(input: string) => setInputValues((prevInputs) => ({ ...prevInputs, password: input }))}
								validate={(valid: boolean) => setFormValid((prevValid) => ({ ...prevValid, password: valid }))}
								isValid={isFormValid.password} />

							<Input type='passwordConf' fontSize="16px" color="white"
								bgColor={variables.sociallightcolor}
								border="1px solid white" placeHolder="Confirmer mot de passe"
								setValue={(input: string) => setInputValues((prevInputs) => ({ ...prevInputs, passconf: input }))}
								validate={(valid: boolean) => setFormValid((prevValid) => ({ ...prevValid, passconf: valid }))}
								isValid={isFormValid.passconf}
							/>
						</div>
					}
					<Button type="submit" disabled={pubOrPrivOrProt === "PROTECTED" ? Object.values(isFormValid).includes(false) : !isFormValid.chanName}>
						<span>Valider</span>
					</Button>
				</form>
				<div className={styles.errorAlert} id="alert" />
			</div>

		</MyPopover >
	)
}
