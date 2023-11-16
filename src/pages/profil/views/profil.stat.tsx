import React, { useEffect, useState } from "react";
import { BarLevel } from "../../../component/barLevel/barLevel";
import variables from "./../../../global.scss"
import styles from "./profil.views.module.scss"
import { Profil } from "../../../lib/types/user.type";
import { useNavigate } from "react-router-dom";
import { Loader } from "../../../component/loader/loader";
import { SearchMatch } from "../../../component/searchMatch/searchMatch";
import { displayRequestStatus } from "../../../layout/main.layout";
import { sendWrapper } from "../../../lib/utils";

type RankProps = {
	rank: string,
	w?: string,
	h?: string,
	fontSize?: string,
}

type StatCardProps = {
	title?: string,
	w?: string,
	h?: string,
}

export const StatCard: React.FC<StatCardProps> = ({
	title,
	w = "50%",
	h
}) =>
{
	return (
		<div className={styles.statCardContainer} style={{ width: w, height: h }}> {title}</div>
	)
}


export const Rank: React.FC<RankProps> = ({ rank,
	w,
	h,
	fontSize = "50px" }) =>
{
	return (
		<div className={styles.rank} style={{ fontSize, width: w, height: h }}>
			{rank}
			<div className={styles.delimitor} />
		</div>
	)
}


export const RatioCircle: React.FC<{ percent: number, fs?: string }> = ({ percent, fs = "30px" }) =>
{

	const percentCalc = percent > 0 ? 180 / (100 / percent) : 0

	return (<div className={styles.circleWrap} >
		<div className={styles.circle}>

			<div className={styles.mask + " " + styles.full} style={{ "--angle": `${percentCalc}deg` } as React.CSSProperties}>
				<div className={styles.fill} style={{ "--angle": `${percentCalc}deg` } as React.CSSProperties}></div>
			</div>

			<div className={styles.mask + " " + styles.half} style={{ "--angle": `${percentCalc}deg` } as React.CSSProperties}>
				<div className={styles.fill} style={{ "--angle": `${percentCalc}deg` } as React.CSSProperties}></div>
			</div>

			<div className={styles.insideCircle} >
				<i style={{ fontSize: fs }}>{percent} %</i>
			</div>
		</div>
	</div>)


}

export const ProfilStat: React.FC<{ profil: Profil }> = ({ profil }) =>
{
	const stats = profil.stats
	const partyNumber = stats.win + stats.lose

	let ratio = Math.round((stats.win / (stats.lose + stats.win)) * 100)
	
	if (isNaN(ratio))
		ratio = 0

	const [matchList, setMatchLits] = useState(null)


	const navigate = useNavigate()



	useEffect(()=>{
		sendWrapper("get", `/match/getAllUserMatch/${profil.userId}`, (res) => setMatchLits(res?.data), handleError)
		// eslint-disable-next-line
	}, [])

	const handleError = (error: any) =>
	{
		navigate("/")
		displayRequestStatus(false, "Une erreure est survenue, veulliez réesayer.", 2000)
	}

	if (!matchList)
		return (
			<Loader />)

	return (
		<div >
			<div className={styles.container}>
				<h2>Statistiques</h2>
				<BarLevel className={styles.barlevel}
					w='min(80%, 1100px)' h="35px"
					bgColor="white" progressionColor={variables.pinkcolor}
					percentage={`${stats.percentXp}%`}
					placeHolder={`Niveau ${stats.level}`}
					placeHolder2={`${stats.xp} xp`}
					placeHolderColor="black" />

				<BarLevel className={styles.barlevel}
					w='min(80%, 1100px)' h="119px"
					bgColor={variables.redcolor} progressionColor={variables.greenbarcolor}
					percentage={`${ratio}%`}
					placeHolder={`${stats.win} victoires sur ${partyNumber} parties`}
					rightElem={<RatioCircle percent={ratio} fs="30px" />} />

			</div>
			<div className={styles.container}>
				<h2>Historique</h2>
				<SearchMatch  seeResult={true} watchable={false} matchs={matchList || null} />
			</div>

		</div>
	)
}
