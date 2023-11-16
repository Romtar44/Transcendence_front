import styles from './twoFaAuth.module.scss'
import { MagicBoxLayout } from '../../layout/magicBox.layout'
import { QrForm } from '../../component/qrForm/qrForm'
import { useNavigate } from 'react-router-dom'
import { useContext, useEffect } from 'react'
import { UserContext } from '../../lib/context'
import LogoutButton from '../../component/logoutButton/logoutButton'

export const TwoFaAuth = () =>
{
	const { isConnected } = useContext(UserContext);


	useEffect(() =>
	{
		if (isConnected)
			navigate("/")
		// eslint-disable-next-line
	}, [isConnected])

	const navigate = useNavigate()
	return (
		<MagicBoxLayout crossDisplay={false}>
			<div className={styles.cont}>
				<QrForm action='authenticate' navigator={navigate} />
				<LogoutButton className={styles.logoutButton} />
			</div>
		</MagicBoxLayout >
	)
}
