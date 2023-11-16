import variables from '../../global.scss'
import styles from './statusIcon.module.scss'
import { Profil, Status } from '../../lib/types/user.type'

export type StatusIconProps = {
	profil: Profil | undefined
	w?: string,
	displayText?: boolean
	className?: string
	isPending?: boolean
	hasInvited?: boolean
}

const statusColors: Record<Status, string> = {
	"ONLINE": variables.statusgreencolor,
	"OFFLINE": variables.statusgreycolor,
	"PLAYING": variables.statuspinkcolor,
	"AWAY": variables.statusyellowcolor,
}

export const StatusIcon: React.FC<StatusIconProps> = ({
	profil,
	w = "10px",
	displayText = true,
	className,
	isPending = false,
	hasInvited
}) =>
{
	if (isPending)
		return (<div className={styles.statusIconContainer + " " + className} >
			<span className={styles.pending} style={{ fontSize: w }}>En attente d'acceptation</span>
		</div>)

	if (hasInvited)
		return (<div className={styles.statusIconContainer + " " + className} >
			<span className={styles.pending} style={{ fontSize: w }}>Voudrais etre votre ami</span>
		</div>)

	return (
		<div className={styles.statusIconContainer + " " + className} >
			<div className={styles.statusIcon} style={{ width: w, height: w, backgroundColor: statusColors[profil?.status || "OFFLINE"] }} />
			{
				displayText &&
				<span style={{ color: statusColors[profil?.status || "OFFLINE"], fontSize: w }}>{profil?.status || "OFFLINE"}</span>
			}
		</div >
	)
}
