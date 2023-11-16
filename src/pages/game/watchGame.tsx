import { useEffect } from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { SearchMatch } from "../../component/searchMatch/searchMatch"
import { displayRequestStatus } from "../../layout/main.layout"
import { sendWrapper } from "../../lib/utils"

export const WatchGame = () =>
{

	const [matchList, setMatchLits] = useState(null)


	const navigate = useNavigate()

	const handleSuccess = (res: any) =>
	{
		setMatchLits(res?.data)
	}

	const handleError = (error: any) =>
	{
		navigate("/game")
		displayRequestStatus(false, "Une erreure est survenue, veulliez réesayer.", 2000)
	}

	useEffect(() =>
	{
		sendWrapper("get", '/game/getWatchableMatch', handleSuccess, handleError)
		// eslint-disable-next-line
	}, [])

	return (

		<SearchMatch watchable={true} matchs={matchList} />
	)
}
