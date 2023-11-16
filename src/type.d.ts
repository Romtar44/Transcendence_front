declare module '*.module.scss' {
	const classes: { [key: string]: string };
	export default classes;
}

declare module '*global.scss' {
	const classes: { [key: string]: string };
	export default classes;
}
