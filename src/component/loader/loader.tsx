import React from "react"
import { Button } from "../button/button"
import styles from "./loader.module.scss"

export const Loader: React.FC<{ title?: string, className?: string, cancel? : ()=> void }> = ({ title, className, cancel }) =>
{
	return (
		<div className={styles.container + " " + className}>
			<div className={styles.ldsring}>
				<div>
				</div>
				<div>
				</div>
				<div>
				</div>
				<div>
				</div>
			</div>
			{title && <p>{title}</p>}
			{cancel && <Button className={styles.cancelButton} onClick={() => cancel()}><span>Annuler</span></Button>}
		</div>)
}

export const LoaderAwait: React.FC<{ username: string, cancel? : ()=> void  }> = ({ username, cancel }) =>
{
	return (
		<Loader className={styles.awaitLoader} title={`${username}`} cancel={cancel}/>
	)
}
