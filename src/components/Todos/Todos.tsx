import { useContext, useEffect, useState } from 'react'
import { TodosContext } from '../../context/TodosContext'
import { TodosProps } from './Todos.props'
import { Statline } from '../Statline/Statline'
import { ITodo } from '../../interfaces/todo.interface'
import styles from './Todos.module.css'
import cn from 'classnames'
import { v4 as uuidv4 } from 'uuid'
import { todosRef } from '../../firebase/firebase'
import { Todo } from '../Todo/Todo'

export const Todos = ({ className, ...props }: TodosProps): JSX.Element => {
	const {todosListFilter, activeNumSet, completedNumSet} = useContext(TodosContext)
	const [todos, setTodos] = useState<ITodo[]>([])
	
	useEffect(() => {
		todosRef.on('value', snapshot => {
			let items = snapshot.val()
			let newState: ITodo[] = []

			for (let item in items) {
				const newTodo = {
					id: item,
					title: items[item].title,
					description: items[item].description,
					date: items[item].date,
					filedata: items[item].filedata,
					completed: items[item].completed
				}	
				newState.push(newTodo)		
			}
			setTodos(newState)
		
			activeNumSet(newState.filter( todo => !todo.completed ).length)
			completedNumSet(newState.filter( todo => todo.completed ).length)
			})
	}, [])

	const filteredTodoList = (totalTodosList: ITodo[]): ITodo[] => {
		let filteredTodosList: ITodo[] = []

		switch (todosListFilter) {
			case 'all':
				filteredTodosList = totalTodosList
				break
			case 'active':
				filteredTodosList = totalTodosList.filter(todo => !todo.completed)
				break
			case 'completed':
				filteredTodosList = totalTodosList.filter(todo => todo.completed)
				break
			default:
				filteredTodosList = totalTodosList
				break
		}

		return filteredTodosList
	}

	return (
		<>
			<div {...props} className={cn(className, styles.todos)}>
				<div className={styles.todosList}>{	
					filteredTodoList(todos).map(todo => <Todo todo={todo} key={uuidv4()}/>)}	
				</div>
				<Statline className={styles.statline} />
			</div>
		</>
	)
}