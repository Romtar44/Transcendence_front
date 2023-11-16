import { useState } from "react"
import styles from "./input.module.scss"
import { ViewIcon, WarningIcon } from "@chakra-ui/icons"

type specialFormats = "username" | "email" | "passwordType" | "passwordConf"

const regexPatterns: Record<specialFormats, { reg: RegExp, msg: string }> = {
	username: {
		msg: "Le nom d'utilisateur doit contenir moins de 18 caractères alpha-numériques et (- . _)",
		reg: /^[a-zA-Z0-9._-áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ]{1,18}$/
	},
	email: {
		msg: "L'e-mail doit suivre ce format : exemple@email.com",
		reg: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
	},
	passwordType: {
		msg: "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et 8 caractères",
		reg: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
	},
	passwordConf: {
		msg: "Les mots de passent ne correspondent pas",
		reg: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
	}
}

type InputProps = {
	h?: string
	type?: string,
	placeHolder?: string,
	border?: string,
	color?: string,
	fontSize?: string,
	value?: string,
	bgColor?: string,
	className?: string,
	required?: boolean,
	validate?: (valid: boolean) => void
	isValid?: boolean
	defaultValue?: string
	setValue: (input: string) => void
	disabled?: boolean
	hideHint?: boolean,
	onBlur?: () => void
}

const regexToString = (regexPat: RegExp | string) =>
{
	if (regexPat === regexPatterns.email.reg)
		return ("^[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}$")
	const regexString = regexPat.toString()
	return (
		regexString.slice(2, regexString.length - 2)
	)
}

const isSpecialFormat = (type: specialFormats | string): type is specialFormats =>
{
	return (type === "email" || type === "username" || type === "passwordType" || type === "passwordConf")
}

export const Input: React.FC<InputProps> = ({
	h = '38px',
	type = 'text',
	color = 'black',
	bgColor = "white",
	border = "1px solid white",
	required = true,
	placeHolder,
	fontSize,
	className,
	defaultValue,
	validate,
	isValid = true,
	setValue,
	value,
	disabled = false,
	hideHint = false,
	onBlur = () => void 0
}) =>
{
	const [isEmpty, setIsEmpty] = useState(defaultValue ? false : true)
	const [isFocus, setIsFocus] = useState(false)
	const [isPasswordHiden, hidePassword] = useState(true)

	const onChange = (input: string) =>
	{
		isPatternValid(input)
		setIsEmpty(input === "")
		setValue(input)
	}

	const isPatternValid = (input: string) =>
	{
		if (isSpecialFormat(type) &&
			validate !== undefined)
		{
			validate(regexPatterns[type].reg.test(input))
		}
	}

	const regFormat = isSpecialFormat(type) && validate !== undefined ? { reg: regexToString(regexPatterns[type].reg), msg: regexPatterns[type].msg } : undefined

	return (
		<div style={{ backgroundColor: "inherit" }} className={`${styles.inputContainer} ${className}`}>
			<input
				className={`
					${styles.input}
					${validate === undefined && styles.noValidation}
					${!isEmpty && styles.notEmpty}
					${!isValid && styles.notValid}
					${type.includes("password") && isPasswordHiden && styles.passwordType}`}
				type={!isPasswordHiden ? "text" : type}
				style={{ height: h, color, backgroundColor: bgColor, border, fontSize }}
				placeholder={placeHolder}
				required={required}
				value={value}
				onChange={(event) => onChange(event.target.value)}
				defaultValue={defaultValue}
				pattern={regFormat?.reg}
				onFocus={() => setIsFocus(true)}
				onBlur={() =>
				{
					setIsFocus(false)
					onBlur()
				}}
				disabled={disabled}
			/>
			<span className={styles.topPlaceholder} style={{ backgroundColor: "inherit", color }}>{placeHolder}</span>

			{
				type.includes("password") && !isEmpty && <ViewIcon className={styles.eyeIcon} onClick={() => hidePassword((prev) => !prev)} />
			}

			{
				isFocus && !isValid && !hideHint &&
				<div className={styles.notValidMsg}
					style={{ color: isEmpty ? 'white' : 'red' }}>
					<WarningIcon w={15} h={15} color={isEmpty ? 'white' : 'red'} />
					<span>{regFormat?.msg}</span>
				</div>
			}
		</div>)

}
