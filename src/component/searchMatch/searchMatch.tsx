import React, { useContext, useState } from 'react'
import { useEffect } from 'react';
import { UserContext } from '../../lib/context';
import { Match } from '../../lib/types/user.type';
import { Input } from '../input/input';
import styles from './searchMatch.module.scss'
import { MatchBox } from '../matchBox/matchBox';

type SearchMatchProps = {
	matchs: Match[] | null,
	className?: string,
	watchable: boolean,
	seeResult?: boolean
}

export const SearchMatch: React.FC<SearchMatchProps> = ({
	matchs,
	className,
	watchable,
	seeResult = false
}) =>
{
	const [foundItem, setFoundItems] = useState<Match[]>(matchs || []);
	const [value, setValue] = useState("");
	const { user } = useContext(UserContext);

	useEffect(() =>
	{
		setFoundItems(matchs || [])
	}, [matchs])

	useEffect(() =>
	{
		const sortMatch = (a: Match, b: Match) =>
		{

			return a.timeStamp < b.timeStamp ? -1 : 1
		}

		const foundMatches = matchs?.filter(match => match.players[0] && match.players[1] && (match.players[0].userName.toLowerCase().includes(value.toLowerCase()) || match.players[1].userName.toLowerCase().includes(value.toLowerCase()))) || []
		setFoundItems(foundMatches?.sort(sortMatch))
	}, [value, matchs, user])

	return (
		<div className={`${styles.searchBar} ${className}`}>
			<Input bgColor="inherit" border='1px solid white'
				color='white'
				className={styles.searchInput}
				setValue={(e) => setValue(e)} placeHolder="Rechechez un utilisateur" />
			{
				foundItem.length > 0 ?
					<ul>
						{
							foundItem.map(elem =>
							{
								if (elem.players[0] && elem.players[1])
									return <li key={elem.id}>
										<MatchBox seeResult={seeResult} watchable={watchable} player1={elem.players[0]} player2={elem.players[1]} gameId={elem.id} score={{ p1: elem.p1Score, p2: elem.p2Score }} />
									</li>
								else
									return null
							})
						}
					</ul>
					:
					<p>Aucun match disponible</p>}
		</div>
	);
}
