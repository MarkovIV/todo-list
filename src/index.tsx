import ReactDOM from 'react-dom/client'
import App from './App'
import { TodosState } from './context/TodosContext'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

root.render(
	<TodosState>
		<App />
	</TodosState>
)


