import firebase from 'firebase/compat/app'
import 'firebase/compat/database'
import { getDownloadURL, getStorage, listAll, ref, uploadBytes } from "firebase/storage"
import { sortFileNames } from '../helpers/helpers'
import { IFileData } from '../interfaces/todo.interface'

const firebaseConfig = {
	apiKey: process.env.REACT_APP_APIKEY,
	authDomain: process.env.REACT_APP_AUTHDOMAIN,
	databaseURL: process.env.REACT_APP_DB,
	projectId: process.env.REACT_APP_PID,
	storageBucket: process.env.REACT_APP_SB,
	messagingSenderId: process.env.REACT_APP_SID,
	appId: process.env.REACT_APP_APPID
}

const app = firebase.initializeApp(firebaseConfig)
const databaseRef = firebase.database().ref()

export const storage = getStorage(app)
export const todosRef = databaseRef.child('todos')

export const updateTodoFiles = async (todoId: string) => {
	const filesListRef = ref(storage, todoId)
	
	let filesData: IFileData[] = []

	const response = await listAll(filesListRef)
				
	response.items.forEach( async file => {
		const url = await getDownloadURL(file)
		
		filesData.push({name: file.name, link: url})
	})

	filesData.sort((fileData1, fileData2) => sortFileNames(fileData1.name, fileData2.name))

	return filesData
}

export const uploadFile = async (todoIdent: string, filesArray: File[]) => {		
	let filesData: IFileData[] = []

	for (let i = 0; i < filesArray.length; i++) {
		const fileRef = ref(storage, `${todoIdent}/${filesArray[i].name}`)
		
		try {
			await uploadBytes(fileRef, filesArray[i])

			const url = await getDownloadURL(fileRef)

			filesData.push({name: filesArray[i].name, link: url})
		} catch (e) {
			console.log(e)
		}
	}	
	return filesData
}


