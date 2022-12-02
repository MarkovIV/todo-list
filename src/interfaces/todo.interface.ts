export interface IFileData {
	name: string
	link: string | undefined
}

export interface ITodo {
	id: string
	title: string
	description: string
	date: string
	filedata: IFileData[]
	completed: boolean
}

