import { useContext, useEffect, useState } from 'react'
import { TodosContext } from '../../context/TodosContext'
import { StatlineProps } from './Statline.props'
import styles from './Statline.module.css'
import cn from 'classnames'

export const Statline = ({ className, ...props }: StatlineProps): JSX.Element => {
	const {activeNum, completedNum} = useContext(TodosContext)
	const [statlineView, setStatlineView] = useState<JSX.Element>(<></>)

	useEffect(() => {
		constructStatlineView()
	}, [activeNum, completedNum])

	const constructStatlineView = () => {
		const updatedStatlineView = (): JSX.Element => {
			return (
				<>				
					<div className={styles.total}>Total: {activeNum + completedNum}</div>
					<div className={styles.active}>Active: {activeNum}</div>
					<div className={styles.completed}>Completed: {completedNum}</div>					
				</>
			)			
		}

		setStatlineView(updatedStatlineView())
	}

	return (
		<>
			<div id='statline' {...props} className={cn(className, styles.statline)}>
				{statlineView}	
			</div>				
		</>
	)
}