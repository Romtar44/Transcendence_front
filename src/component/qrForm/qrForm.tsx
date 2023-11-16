import React, { useContext, useState } from "react";
import styles from "./qrForm.module.scss"
import { sendWrapper } from "../../lib/utils";
import { UserContext } from "../../lib/context";
import { Button } from "../button/button";
import { displayRequestStatus, displayWhatever } from "../../layout/main.layout";
import { Input } from "../input/input";
import { updateStatusSocket } from "../../socket";
import { NavigateFunction } from "react-router-dom";


export const QrForm: React.FC<{ setDoubleAuth?: (tfa: boolean) => void, action: "update" | "authenticate", navigator: NavigateFunction }> =
	({ setDoubleAuth, action, navigator }) =>
	{

		const [doubleAuthCode, setDoubleAuthCode] = useState<string>("")
		const { setUser, updateFriendList, setIsConnected } = useContext(UserContext);


		const authenticate = (e: any) =>
		{
			e.preventDefault()
			sendWrapper("post", '/tfa/authenticate',
				(res) =>
				{
					setUser({ ...res?.data.user })
					updateFriendList()
					setIsConnected(true)
					updateStatusSocket()
					navigator("/")
				},
				(err) =>
				{
					displayRequestStatus(false, err.response.data.message)
				},
				{ code: doubleAuthCode })
		}

		const updateTwoAuth = (e: any) =>
		{
			e.preventDefault()
			sendWrapper("post", '/tfa/turn-on-qr',
				(res) =>
				{
					if (setDoubleAuth)
						setDoubleAuth(true)
					displayWhatever(undefined, true)
					displayRequestStatus(true, "Double authentification activée")
					updateStatusSocket()
				},
				(err) =>
				{
					if (setDoubleAuth)
						setDoubleAuth(false)
					displayRequestStatus(false, err.response.data.message)
				},
				{ code: doubleAuthCode })
		}

		return (<form className={styles.form} onSubmit={(e) =>
		{
			if (action === "update")
				updateTwoAuth(e)
			else if (action === "authenticate")
				authenticate(e)
		}}
		>
			<p>Renseignez le code obtenu pour activer la double authentification.</p>
			<div>
				<Input setValue={setDoubleAuthCode} fontSize="20px" bgColor={"inherit"} color="white" placeHolder="Code" />
				<Button type="submit"><span>OK</span></Button>
			</div>
		</form>)
	}
