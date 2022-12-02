import './styles/globals.css'
import { Todos } from './components/Todos/Todos'
import { Navbar } from './components/Navbar/Navbar'
import { TodoInput } from './components/TodoInput/TodoInput'

function App() {

	return (
		<>
		<Navbar />
		<TodoInput />
		<Todos />
		</>	
	)	
}

export default App
