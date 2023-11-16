import { useContext } from "react"
import { Navigate } from "react-router-dom"
import { UserContext } from "../../lib/context";
import { Loader } from "../loader/loader";

type SignInGuardPops = {
	redir: boolean
	element: JSX.Element
	redirTo: string
}
export const SignInGuard: React.FC<SignInGuardPops> = ({
	redir,
	element,
	redirTo
}) =>
{
	const { isLoaded, isConnected, isSimpleConnected } = useContext(UserContext);

	if (!isLoaded)
		return <Loader />

	if (redir)
	{
		if (!isConnected && isSimpleConnected)
			return <Navigate replace to={'/two-fa-authenticate'} />
		return <Navigate replace to={redirTo} />
	}
	else
		return element
}
