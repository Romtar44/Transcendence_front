import styles from "./home.module.scss"
import { Button } from "../../component/button/button";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../lib/context";
import LogoutButton from "../../component/logoutButton/logoutButton";
import { BackToGame } from "../../component/backToGame/backToGame";

export default function Home()
{
	const navig = useNavigate()
	const { user } = useContext(UserContext);
	if (!user)
	{
		return null
	}

	return (
		<div className={styles.container}>
			<BackToGame />
			<div className={`${styles.playcontainer} ${styles.door}`}>
				<div>
					<Button mouseOver="Shadow" onClick={() => { navig("/game") }} >
						<b>
							JOUER
						</b>
					</Button>
				</div>
			</div>
			<div className={`${styles.profilcontainer} ${styles.door}`}>
				<div>
					<Button mouseOver="Shadow" onClick={() => { navig("/profil") }}>
						<b>
							PROFIL
						</b>
					</Button>
				</div>
			</div>
			<div className={`${styles.socialcontainer} ${styles.door}`}>
				<div>
					<Button mouseOver="Shadow" onClick={() => { navig("/social") }}>
						<b>
							SOCIAL
						</b>
					</Button>
				</div>
			</div>
			<LogoutButton className={styles.logoutButton} />
		</div >
	)
}
