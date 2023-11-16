import styles from './main.layout.module.scss'
import { ResultHandler } from '../component/resultHandler/resultHandler'
import { Root, createRoot } from "react-dom/client"

type LayoutProps = {
	children: JSX.Element,
	title?: string
}

let notif: Root | null = null


export let divRoot: Root | null = null

export const displayWhatever = (toRender?: React.ReactNode, reset = false) =>
{
	const div = document.getElementById("whatever")
	if (div)
	{
		if (!divRoot)
			divRoot = createRoot(div);
		if (reset)
			divRoot.render(<div id='whatever' />)

		else if (toRender)
			divRoot.render(toRender)
	}
}

export const displayRequestStatus = async (status: boolean, msg: string, timer = 2000) =>
{
	const notifDiv = document.getElementById("requestStatus")
	if (notifDiv)
	{
		if (notif === null)
			notif = createRoot(notifDiv)
		notif.render(<ResultHandler resultMessage={msg} successStatus={status} />)
		await new Promise(f => setTimeout(f, timer))
		notif.render(<div id='requestStatus' />)

	}
}

export const MainLayout = ({
	children,
	title
}: LayoutProps) =>
{

	return (
		<div className={styles.container}>
			<div className={styles.main}>
				{children}
			</div>
			<div id='whatever' />
			<div id='requestStatus' />

		</div>

	)
}


