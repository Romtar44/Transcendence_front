import React, { useEffect, useRef, useState } from "react"
import { GameOption, GameOptionIndex } from "../../pages/game/customGame"
import styles from "./slider.module.scss"

type SliderProps = {
	id: string,
	inputValue: number,
	min: number,
	max: number,
	step: number,
	setInputValue: React.Dispatch<React.SetStateAction<GameOption>>,
	type: GameOptionIndex,
}

export const Slider: React.FC<SliderProps> = ({
	id,
	inputValue,
	min,
	max,
	step,
	setInputValue,
	type = "ballSpeed"
}) =>
{
	const [sliderRange, setSliderRange] = useState(inputValue)
	const sliderRef = useRef<HTMLInputElement>(null)

	function handleSliderInput()
	{
		if (!sliderRef || !sliderRef.current)
			return
		const range = max - min

		const distance = Number(sliderRef.current.value) - min

		const percentage = (distance / range) * 100

		setSliderRange(percentage)
		setInputValue(prevInput =>
		{
			if (!sliderRef || !sliderRef.current)
				return prevInput
			const copy = { ...prevInput }
			copy[type] = Number(sliderRef.current.value)
			return (copy)
		})
	}

	function handleNumberInput(e: any)
	{
		const newValue = parseInt(e.target.value)

		if (newValue < min)
		{
			setInputValue(prevInput =>
			{
				const copy = { ...prevInput }
				copy[type] = min
				return (copy)
			})
			setSliderRange(0)
		}
		else if (newValue > max)
		{
			setInputValue(prevInput =>
			{
				const copy = { ...prevInput }
				copy[type] = max
				return (copy)
			})
			setSliderRange(100)
		}
		else
		{
			setInputValue(prevInput =>
			{
				const copy = { ...prevInput }
				copy[type] = newValue
				return (copy)
			})

			const range = max - min
			const distance = newValue - min
			const percentage = (distance / range) * 100
			setSliderRange(percentage)
		}
	}

	useEffect(() =>
	{
		handleSliderInput()
		// eslint-disable-next-line
	}, [sliderRef])


	return (
		<div className={styles.rangeSlider}>
			<div className={styles.sliderValues}>
				<small>{min}</small>
				<input type="number" className={styles.numberInput}
					onInput={handleNumberInput}
					min={min} max={max} step={step} value={inputValue} />
				<small>{max}</small>
			</div>
			<div className={styles.sliderContainer}>
				<input className={styles.slider} type="range"
					onInput={handleSliderInput}
					min={min} max={max} step={step} value={inputValue} ref={sliderRef} />
				<div className={styles.sliderThumb}
					style={{ left: `calc(${sliderRange}% - 0.5rem)` }} ></div>
				<div className={styles.progress}
					style={{ width: `${sliderRange}%` }}></div>
			</div>
		</div>
	)
}
