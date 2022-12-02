import { TodoProps } from './Todo.props'
import { Checkbox } from '../Checkbox/Checkbox'
import { useState, useEffect, useContext } from 'react'
import { TodosContext } from '../../context/TodosContext'
import { ReactComponent as ClipIcon } from './icons/clip.svg'
import { ReactComponent as ExpandIcon } from './icons/expand.svg'
import { ReactComponent as SaveIcon } from './icons/save.svg'
import { ReactComponent as EditIcon } from './icons/edit.svg'
import { ReactComponent as DeleteIcon } from './icons/delete.svg'
import styles from './Todo.module.css'
import cn from 'classnames'
import { Modal } from '../Modal/Modal'
import { todosRef, storage, uploadFile } from '../../firebase/firebase'
import { ref, deleteObject, StorageReference, listAll } from "firebase/storage"
import { IFileData } from '../../interfaces/todo.interface'
import { sortFileNames } from '../../helpers/helpers'
import dayjs from 'dayjs'

export const Todo = ({ todo, className, ...props }: TodoProps): JSX.Element => {
	const {activeNum, activeNumSet, completedNum, completedNumSet} = useContext(TodosContext)
	const [expand, setExpand] = useState<boolean>(false)
	const [title, setTitle] = useState<string>(todo.title)
	const [description, setDescription] = useState<string>(todo.description)
	const [date, setDate] = useState<string>(todo.date)
	const [fileData, setFileData] = useState<IFileData[]>(todo.filedata)
	const [files, setFiles] = useState<File[]>([])
	const [completed, setCompleted] = useState<boolean>(todo.completed)
	const [inputError, setInputError] = useState<boolean>(false)
	const [highlightFilesIcon, setHighlightFilesIcon] = useState<string>('')
	const [highlightExpandIcon, setHighlightExpandIcon] = useState<string>('')
	const [timeIsOver, setTimeIsOver] = useState<string>('')
	const [editable, setEditable] = useState<boolean>(false)
	const [isCompletedStyle, setIsCompletedStyle] = useState<string>('')
	const [modal, setModal] = useState<boolean>(false)

	useEffect(() => {
		if (completed) {
			setIsCompletedStyle(styles.completed)
		} else {
			setIsCompletedStyle('')
		}
		
		if (description.trim().length === 0 ) {
			setHighlightExpandIcon('')
		} else {
			setHighlightExpandIcon(styles.highlightIcon)
		}

		if (fileData?.length > 0) {
			setHighlightFilesIcon(styles.highlightIcon)
		} else {
			setHighlightFilesIcon('')
		}

		if (dayjs(date).isBefore(dayjs().subtract(1, 'day')) && !completed) {
			setTimeIsOver(styles.timeIsOver)
		} else {
			setTimeIsOver('')
		}
	}, [completed, description, fileData?.length, timeIsOver])

	const submitHandler = async (event: React.FormEvent) => {
		event.preventDefault()

		if (title.trim().length === 0 ) {
			setInputError(true)

			setTimeout(() => {
				setInputError(false)
			}, 1000)

			return
		}

		setEditable(!editable)

		if (files.length > 0) {
			const newTodo = {
				title: title,
				description: description,
				date: date,
				completed: completed
			}

			const fileRef = ref(storage, todo.id)

			await deleteFilesFromStorage(fileRef)

			const filedata = await uploadFile(todo.id, files)

			todosRef.child(todo.id).set({...newTodo, filedata: filedata})

		} else {
			let fileDataArray: IFileData[]

			if (fileData) {
				fileDataArray = fileData
			} else {
				fileDataArray = []
			}

			const newTodo = {
				title: title,
				description: description,
				date: date,
				completed: completed,
				filedata: fileDataArray
			}

			todosRef.child(todo.id).set(newTodo)
		}	
 	}

	const setCompl = () => {
		let fileDataArray: IFileData[]

		if (fileData) {
			fileDataArray = fileData
		} else {
			fileDataArray = []
		}

		const newTodo = {	
			title: title,
			description: description,
			date: date,
			completed: !completed,
			filedata: fileDataArray
		}

		todosRef.child(todo.id).set(newTodo)
		
		if (completed) {
			activeNumSet(activeNum + 1)
			completedNumSet(completedNum - 1)
		} else {
			activeNumSet(activeNum - 1)
			completedNumSet(completedNum + 1)
		}

		setCompleted(!completed)
	}

	const deleteTodo = () => {
		todosRef.child(todo.id).remove()
		.then (() => {
			const fileRef = ref(storage, todo.id)

			deleteFilesFromStorage(fileRef)		
		})
	}

	const deleteFilesFromStorage = (fileReference: StorageReference): Promise<void> => {
		return listAll(fileReference)
			.then(res => {
				res.items.forEach(itemRef => {
					deleteObject(itemRef)
				})
			}) 
	}

	const deleteHandler = (event: React.FormEvent) => {
		event.preventDefault()

		setModal(true)
 	}

	const yesButtonHandler = (event: React.FormEvent) => {
		event.preventDefault()

		setModal(false)
		
		deleteTodo()
 	}

	const noButtonHandler = (event: React.FormEvent) => {
		event.preventDefault()

		setModal(false)
 	}

	const editHandler = (event: React.FormEvent) => {
		event.preventDefault()

		if (!completed) {
			setEditable(!editable)
		}
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
	}

	const changeDate = (event: React.ChangeEvent<HTMLInputElement>) => {
		setDate(event.target.value)
	}

	const changeFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
		const fileList = event.target.files
		
		if (fileList) {
			let newFiles = []
			let newFileData = []
			let len = fileList.length

			for (let i = 0; i < len; i++) {
				newFiles.push(fileList[i])
				newFileData.push({name: fileList[i].name, link: undefined})
			}

			setFiles(newFiles.sort((file1, file2) => sortFileNames(file1.name, file2.name)))
			setFileData(newFileData.sort((fileData1, fileData2) => sortFileNames(fileData1.name, fileData2.name)))
		} else {
			setFiles([])
			setFileData([])
		}
	}

	const fileList = (fileDataList: IFileData[]): JSX.Element => {
		return (
			<>
				<div className={cn(styles.fileList, timeIsOver)}>
					{fileDataList.map((data, index) => 
						<div key={index}>
							<a key={index} href={data.link} target="_blank" rel='noreferrer'>{data.name}</a>
						</div>
					)}
				</div>
			</>
		)
	}

	return (
		<>
			<div {...props} className={cn(className, styles.todo, isCompletedStyle, timeIsOver)}>
				{editable && <Checkbox className={styles.checkbox} completed={completed}/>}
				{!editable && <Checkbox className={styles.checkbox} completed={completed} setCompl={setCompl}/>}
				<button className={cn(styles.expand, timeIsOver)} onClick={expandHandler}><ExpandIcon className={highlightExpandIcon}/></button>				
				<label className={cn(styles.clip, timeIsOver)}>
					{editable && <input type="file" multiple onChange={changeFiles}/>}
					<ClipIcon className={highlightFilesIcon}/>
				</label>	
				{editable && <input className={styles.title} type="text" placeholder="Enter todo title..." value={title} onChange={changeTitle}/>}
				{!editable && <input className={styles.title} type="text" placeholder="Enter todo title..." value={title} readOnly/>}
				{editable && <input className={styles.date} type="date" value={date} onChange={changeDate}/>}
				{!editable && <input className={styles.date} type="date" value={date} readOnly/>}
				{editable && <button className={cn(styles.submit, timeIsOver)} onClick={submitHandler}><SaveIcon/></button>}
				{!editable && <button className={cn(styles.submit, timeIsOver)} onClick={editHandler}><EditIcon/></button>}
				<button className={cn(styles.delete, timeIsOver)} onClick={deleteHandler}><DeleteIcon/></button>
				<div></div>
				<div></div>
				<div className={styles.inputError}>{inputError && <span>Please enter todo title</span>}</div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				{expand && ((editable && <textarea className={styles.description} placeholder="Enter todo description..." value={description} onChange={changeDescription}/>) ||	
							(!editable && <textarea className={styles.description} value={description} readOnly/>))}
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				{fileData && expand && fileList(fileData)}
			</div>	
			{modal && <Modal>
				<div className={styles.closeWindow}>
					<h3 className={styles.closeQuestion}>Are you shure?</h3>	
					<div></div>
					<button className={styles.yesCloseWindowButton} onClick={yesButtonHandler}>Yes</button>
					<button className={styles.noCloseWindowButton} onClick={noButtonHandler}>No</button>
				</div>
			</Modal>
			}
		</>	
	)		
}