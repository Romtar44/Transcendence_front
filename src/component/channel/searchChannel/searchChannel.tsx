import React, { useContext, useState } from 'react'
import { useEffect } from 'react';
import { Channel } from '../../../lib/types/user.type';
import { ChannelBox } from '../channelBox/channelBox';
import styles from './searchChannel.module.scss'
import variables from './../../../global.scss'
import { Input } from '../../input/input';
import { UserContext } from '../../../lib/context';

type SearchChannelProps = {
	channels?: Channel[],
	setDisplayPop: React.Dispatch<React.SetStateAction<boolean>>
}

export const SearchChannel: React.FC<SearchChannelProps> = ({
	channels,
	setDisplayPop
}) =>
{
	const { user } = useContext(UserContext)
	const [foundItem, setFoundItems] = useState<Channel[] | undefined>(channels);
	const [value, setValue] = useState("");


	useEffect(() =>
	{
		const sortUser = (a: Channel, b: Channel) =>
		{
			if (user)
			{
				if ((user.channelPendingList.includes(a.id)))
					return -1
				if (user.channelPendingList.includes(b.id))
					return 1

				return a.channelName.localeCompare(b.channelName)
			}
			return 0
		}

		const foundMatches = channels?.filter(channel => channel.channelName.toLowerCase().includes(value.toLowerCase()))
		if (foundMatches)
			setFoundItems(foundMatches.sort(sortUser))
		// eslint-disable-next-line
	}, [value, channels])

	return (
		<div className={styles.searchBar}>
			<Input bgColor={variables.sociallightcolor} border='1px solid white'
				color='white'
				className={styles.searchInput}
				setValue={(e) => setValue(e)} placeHolder="Rechechez un salon" />
			{
				foundItem && foundItem.length > 0 &&
				<ul>
					{
						foundItem.map(elem =>
							<li key={elem.id}>
								<ChannelBox channel={elem} activeConv={undefined} displayButton={false} addable={true} setDisplayPop={setDisplayPop} />
							</li>)
					}
				</ul>
			}
		</div>
	);
}
