import { CheckboxProps } from './Checkbox.props'
import { useState, useEffect, KeyboardEvent } from 'react'
import styles from './Checkbox.module.css'
import cn from 'classnames'
import { ReactComponent as CheckboxIsDone } from './icons/checkboxIsDone.svg'
import { ReactComponent as CheckboxIsNotDone } from './icons/checkboxIsNotDone.svg'

export const Checkbox = ({ completed, setCompl, className, ...props }: CheckboxProps): JSX.Element => {
	const [checkBox, setCheckBox] = useState<JSX.Element>(<></>)
	const [complStatus, setComplStatus] = useState<boolean>(completed)

	useEffect(() => {
		constructCheckBox(complStatus)

	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [complStatus])
	
	const constructCheckBox = (currentCompleted: boolean) => {
		const updatedCheckBox = (): JSX.Element => {		
			if (currentCompleted) {
				return (				
					<div
						className={cn(className, styles.checkbox)}
						onClick={() => onClick()}
						tabIndex={0}
						onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => handleSpace(e)}
						>
						<CheckboxIsDone/>						
					</div>				
				)
			}
			else {
				return (
					<div
						className={cn(className, styles.checkbox)}
						onClick={() => onClick()}
						tabIndex={0}
						onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => handleSpace(e)}
						>
						<CheckboxIsNotDone/>
					</div>						
				)
			}			
		}

		setCheckBox(updatedCheckBox())
	}

	const completedEdit = () => {
		if (setCompl) {
			setCompl()
			constructCheckBox(!complStatus)
			setComplStatus(!complStatus)
		}
	}

	const onClick = () => {
		completedEdit()
	}

	const handleSpace = (e: KeyboardEvent<HTMLDivElement>) => {
		if (e.code !== 'Space') {
			return
		}

		completedEdit()
	}

	return (
		<div {...props} className={className}>
			{checkBox}		
		</div>	
	)		
}