import { createContext, useState } from 'react'

interface ITodosContext {
  todosListFilter: string
  todosListFilterSet: (filter: string) => void
  activeNum: number
  activeNumSet: (num: number) => void
  completedNum: number
  completedNumSet: (num: number) => void
}

export const TodosContext = createContext<ITodosContext>({
  todosListFilter: 'all',
  todosListFilterSet: (filter: string) => {},
  activeNum: 0,
  activeNumSet: (num: number) => {},
  completedNum: 0,
  completedNumSet: (num: number) => {}
})

export const TodosState = ({ children }: {children: React.ReactNode}) => {
	const [todosListFilter, setTodosListFilter] = useState<string>('all')
	const [activeNum, setActiveNum] = useState<number>(0)
	const [completedNum, setCompletedNum] = useState<number>(0)

	const todosListFilterSet = (filter: string) => {
		setTodosListFilter(filter)
	}

	const activeNumSet = (num: number) => {
		setActiveNum(num)
	}

	const completedNumSet = (num: number) => {
		setCompletedNum(num)
	}

	return (
		<TodosContext.Provider value={{ todosListFilter,  todosListFilterSet, activeNum,  activeNumSet, completedNum, completedNumSet }}>
		{ children }
		</TodosContext.Provider>
	)
}
