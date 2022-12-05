import { TodoInputProps } from './TodoInput.props'
import { useState, useContext } from 'react'
import { TodosContext } from '../../context/TodosContext'
import { ReactComponent as Enter } from './icons/enter.svg'
import { ReactComponent as ClipIcon } from './icons/clip.svg'
import { ReactComponent as ExpandIcon } from './icons/expand.svg'
import styles from './TodoInput.module.css'
import cn from 'classnames'
import { todosRef, uploadFile } from '../../firebase/firebase'
import { sortFileNames } from '../../helpers/helpers'

export const TodoInput = ({ className, ...props }: TodoInputProps): JSX.Element => {
	const {activeNum,  activeNumSet} = useContext(TodosContext)
	const [expand, setExpand] = useState<boolean>(false)
	const [title, setTitle] = useState<string>('')
	const [description, setDescription] = useState<string>('')
	const [date, setDate] = useState<string>('')
	const [files, setFiles] = useState<File[]>([])
	const [inputError, setInputError] = useState<boolean>(false)
	const [highlightFilesIcon, setHighlightFilesIcon] = useState<string>('')
	const [highlightExpandIcon, setHighlightExpandIcon] = useState<string>('')

	const submitHandler = (event: React.FormEvent) => {
		event.preventDefault()

		if (title.trim().length === 0 ) {
			setInputError(true)

			setTimeout(() => {
				setInputError(false)
			}, 1000)

			return
		}

		const newTodo = {	
			title: title,
			description: description,
			date: date,
			completed: false,
			filedata: []
		}
		
		todosRef.push(newTodo).then( async res => {
			const todoId = res.key

			if (todoId) {
				if (files) {
					const filedata = await uploadFile(todoId, files)

					todosRef.child(todoId).set({...newTodo, filedata: filedata})
				}
				activeNumSet(activeNum + 1)
			}
		})

		setTitle('')
		setDescription('')
		setDate('')
		setHighlightFilesIcon('')
		setHighlightExpandIcon('')
		setFiles([])
		setExpand(false)
 	}

	const expandHandler = (event: React.FormEvent) => {
		event.preventDefault()	
		
		setExpand(!expand)
 	}

	const changeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
		setTitle(event.target.value)
	}

	const changeDescription = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		const text = event.target.value

		setDescription(text)

		if (text.trim().length === 0 ) {
			setHighlightExpandIcon('')
		} else {
			setHighlightExpandIcon(styles.highlightIcon)
		}
	}

	const changeDate = (event: React.ChangeEvent<HTMLInputElement>) => {
		setDate(event.target.value)
	}

	const changeFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
		const fileList = event.target.files
		
		if (fileList) {
			let newFiles = []
			let len = fileList.length

			for (let i = 0; i < len; i++) {
				newFiles.push(fileList[i])
			}

			setFiles(newFiles.sort((file1, file2) => sortFileNames(file1.name, file2.name)))

			if (len > 0) {
				setHighlightFilesIcon(styles.highlightIcon)
			} else {
				setHighlightFilesIcon('')
			}
		} else {
			setHighlightFilesIcon('')
		}
	}

	return (		
		<form className={cn(className, styles.todoInput)} {...props}>
			<button className={styles.expand} onClick={expandHandler} ><ExpandIcon className={highlightExpandIcon}/></button>				
			<label className={styles.clip}>
				<input type="file" multiple onChange={changeFiles}/>
				<ClipIcon className={highlightFilesIcon}/>
			</label>	
			<input className={styles.title} type="text" placeholder="Enter todo title..." value={title} onChange={changeTitle}/>
			<input className={styles.date} type="date" value={date} onChange={changeDate}/>
			<button className={styles.submit} onClick={submitHandler}><Enter/></button>
			<div className={styles.inputError}>{inputError && <span>Please enter todo title</span>}</div>
			{expand && <textarea className={styles.description} placeholder="Enter todo description..." value={description} onChange={changeDescription}/>}
			{files && expand && <div className={styles.fileList}>
				{files.map((file, index) => 
					<div key={index}>{file.name}</div>
				)}
			</div>}
		</form>	
	)		
}