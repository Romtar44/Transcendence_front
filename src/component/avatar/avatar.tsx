import Image from "../image/image";
import styles from "./avatar.module.scss"

type AvatarProps = {
	size?: string
	id?: string
}

const Avatar: React.FC<AvatarProps> = ({
	size = "100px",
	id = "1"
}) =>
{
	return (
		<div className={styles.avatar} style={{ width: size, height: size }}>
			{
				<Image className={styles.pp}
					imgSrc={`${process.env.REACT_APP_BACK_URL}/avatar/getAvatar/${id}`}
					w={size} h={size} alt='photo de profil' />
			}
		</div>)
}

export default Avatar
