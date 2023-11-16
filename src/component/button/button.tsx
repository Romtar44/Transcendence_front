import React from "react";
import styles from "./button.module.scss"

type ButtonProps = {
	fontSize?: string,
	color?: string,
	border?: string,
	borderRadius?: string,
	bgColor?: string,
	children: JSX.Element,
	className?: string,
	variant?: "rounded" | "squared",
	type?: "button" | "submit",
	disabled?: boolean,
	onClick?: () => void
	mouseOver?: "Light" | "Shadow"
}

export const Button: React.FC<ButtonProps> = ({
	color = 'black',
	bgColor = "white",
	children,
	className,
	border = "0px",
	variant = "rounded",
	type = "button",
	disabled = false,
	fontSize,
	borderRadius,
	onClick,
	mouseOver = "Shadow"
}) =>
{

	borderRadius = borderRadius ? borderRadius
		: variant === "rounded" ? "20px" : "5px"
	return (
		<button className={`${styles.button} ${className} ${type === "submit" && styles.submit}`}
			onClick={onClick}
			style={{ color, backgroundColor: bgColor, border, fontSize, borderRadius }}
			type={type}
			disabled={disabled}>
			{
				<div className={styles[`mouseOver${mouseOver}`]}
					style={{ borderRadius }} />
			}
			<div className={styles.children}>
				{children}
			</div>
		</button >)
}
