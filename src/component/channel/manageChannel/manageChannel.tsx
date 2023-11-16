import { useState } from 'react'
import styles from './manageChannel.module.scss'
import { SearchChannel } from '../searchChannel/searchChannel'
import { Channel } from '../../../lib/types/user.type'
import { CreateChannel } from '../createChannel/createChannel'
import { MyPopover } from '../../popover/popover'
import plusIcon from '../../../asset/plusIcon.svg'
import Image from '../../image/image'

type ChannelManagerProps = {
	channelList?: Channel[],
	displayPop: boolean,
	setDisplayPop: React.Dispatch<React.SetStateAction<boolean>>
}

export const ChannelManager: React.FC<ChannelManagerProps> = ({
	channelList,
	displayPop,
	setDisplayPop,
}) =>
{
	const [creationMode, setMode] = useState(false)

	return (
		displayPop ?
			<MyPopover display={displayPop} setDisplay={setDisplayPop} >
				<div className={styles.channelManagerContainer}>
					<h1>Salons</h1>
					<div className={styles.optionContainer}>
						<SearchChannel channels={channelList} setDisplayPop={setDisplayPop} />
						<div className={styles.plusIconContainer} title='Créer un nouveau salon'
							onClick={() =>
							{
								setDisplayPop(false)
								setMode(true)
							}}>
							<Image imgSrc={plusIcon} w='25px' alt='Icone plus' />
						</div>
					</div>
				</div>
			</MyPopover >
			:
			creationMode ?
				<CreateChannel createMode={creationMode} setMode={setMode} />
				:
				null
	)
}
