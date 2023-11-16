import React, { useContext, useState } from 'react'
import { useEffect } from 'react';
import { UserContext } from '../../lib/context';
import { Channel, Profil } from '../../lib/types/user.type';
import { ProfilBox } from '../profilBox/profilBox';
import { Input } from '../input/input';
import variables from '../../global.scss'
import styles from './searchFriend.module.scss'
import { GameOption } from '../../pages/game/customGame';

type SearchFriendProps = {
	profils: Profil[],
	className?: string,
	forChannel?: boolean,
	channel?: Channel,
	isBanned?: boolean,
	isGame?: boolean,
	gameVar?: GameOption,
	setDisplayPop?: React.Dispatch<React.SetStateAction<boolean>>,
	addable?: boolean,
	unblock?: boolean
}

export const SearchFriend: React.FC<SearchFriendProps> = ({
	profils,
	className,
	forChannel = false,
	channel,
	gameVar,
	isBanned = false,
	isGame = false,
	setDisplayPop,
	addable = false,
	unblock = false
}) =>
{
	const [foundItem, setFoundItems] = useState<Profil[]>(profils);
	const [value, setValue] = useState("");
	const { user, friendList } = useContext(UserContext);


	useEffect(() =>
	{
		setFoundItems(profils)
	}, [profils])

	useEffect(() =>
	{
		const sortUser = (a: Profil, b: Profil) =>
		{
			if (user && user.pendingList.includes(a.userId))
				return -1

			return a.userName.localeCompare(b.userName)
		}

		const foundMatches = profils.filter(profil => profil.userName.toLowerCase().includes(value.toLowerCase()))
		setFoundItems(foundMatches.sort(sortUser))
		// eslint-disable-next-line
	}, [value, profils])


	return (
		<div className={`${styles.searchBar} ${className}`}>
			<Input bgColor={variables.sociallightcolor} border='1px solid white'
				color='white'
				className={styles.searchInput}
				setValue={(e) => setValue(e)} placeHolder="Rechechez un utilisateur" />
			{
				foundItem.length > 0 &&
				<ul>
					{
						foundItem.map(elem =>
						{
							if (isGame && elem.status !== "ONLINE")
								return null
							else
							{
								const isFriend = friendList.find((friend) => friend.userId === elem.userId) ? true : false

								return <li key={elem.id}>
									{
										forChannel ?
											<ProfilBox addable={addable} profil={elem} activeConv={undefined} isFriend={true} forChannel={forChannel} channel={channel} setDisplayPop={setDisplayPop} />
											:
											<ProfilBox isGame={isGame} gameVar={gameVar} profil={elem} activeConv={undefined} isFriend={isFriend} isBanned={isBanned} channel={channel} unblock={unblock} setDisplayPop={setDisplayPop} />
									}
								</li>
							}
						})
					}
				</ul>
			}
		</div>
	);
}
