import Image from "../image/image";
import logoutLogo from '../../asset/logout.svg'
import { sendWrapper } from "../../lib/utils";
import { disconectSocket } from "../../socket";
import styles from './logoutButton.module.scss'
import { useContext } from "react";
import { UserContext } from "../../lib/context";

export const logout = (setIsConnected?: React.Dispatch<React.SetStateAction<boolean>>) =>
{
	sendWrapper("get", "/auth/logout", () =>
	{
		if (setIsConnected)
			setIsConnected(false)
		disconectSocket()
		window.location.pathname = '/signin'
	}, () => void 0)
}

const LogoutButton: React.FC<{ className?: string }> = ({ className }) =>
{
	const { setIsConnected } = useContext(UserContext)

	return (
		<div className={`${styles.logout} ${className}`} onClick={() => logout(setIsConnected)} title='Déconnexion' >
			<Image imgSrc={logoutLogo} alt="Deconnection" />
		</div>
	);
}

export default LogoutButton;
