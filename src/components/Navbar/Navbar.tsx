import { useContext, useEffect, useState } from 'react'
import { TodosContext } from '../../context/TodosContext'
import { NavbarProps } from './Navbar.props'
import { ReactComponent as Finish } from './icons/finish.svg'
import { ReactComponent as Github } from './icons/github.svg'
import { ReactComponent as Start } from './icons/start.svg'
import styles from './Navbar.module.css'
import cn from 'classnames'

export const Navbar = ({ className, ...props }: NavbarProps): JSX.Element => {
	const {todosListFilter, todosListFilterSet} = useContext(TodosContext)
	const [navbarView, setNavbarView] = useState<JSX.Element>(<></>)

	useEffect(() => {
		constructNavbarView(todosListFilter)
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [todosListFilter])

	const constructNavbarView = (currentTodosListFilter: string) => {
		const todosElement = document.querySelector('#todos') as HTMLElement

		const updatedNavbarView = (): JSX.Element => {
			let classFilter = ''

			switch (currentTodosListFilter) {
			case 'all':
				classFilter = styles.onAll
				break;	
			case 'active':
				classFilter = styles.onActive
				break;	
			case 'completed':
				classFilter = styles.onCompleted
				break;	
			default:
				classFilter = styles.onAll
			}

			return (
				<>
					<div {...props} className={cn(className, styles.navbar, classFilter)}>
						<div className={styles.start}><button onClick={gotoStart}><Start /></button></div>
						<div className={styles.finish}><button><a href='#statline'><Finish /></a></button></div>
						<div></div>	
						<div></div>
						<div className={styles.all}><button onClick={filterSetAll}>All</button></div>
						<div className={styles.active}><button onClick={filterSetActive}>Active</button></div>
						<div className={styles.completed}><button onClick={filterSetCompleted}>Completed</button></div>
						<div></div>	
						<div></div>			
						<div></div>
						<div className={styles.github}><button><a href="https://github.com/MarkovIV" target="_blank" rel='noreferrer'><Github /></a></button></div>			
					</div>	
				</>
			)			
		}

		const gotoStart = () => {	
			if (todosElement) {
				const coords = todosElement.getBoundingClientRect();

				todosElement.style.cssText = `position: fixed; top: 0; left: ${coords.left + "px"};`

				setInterval(() => {todosElement.style.cssText = ""}, 1);		
			}
		}

		setNavbarView(updatedNavbarView())
	}

	const filterSetAll = () => {
		todosListFilterSet('all')
	}

	const filterSetActive = () => {
		todosListFilterSet('active')
	}

	const filterSetCompleted = () => {
		todosListFilterSet('completed')
	}

	return (
		<div {...props} className={className}>
			{navbarView}		
		</div>		
	)
}