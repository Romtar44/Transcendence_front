import styles from './username.module.scss'

const Username: React.FC<{ username?: string, fontSize?: string }> = ({
	username,
	fontSize = "25px"
}) =>
{
	return (
		<span className={styles.username} style={{
			fontSize,

		}}>
			{username}
		</span>)
}

export default Username
