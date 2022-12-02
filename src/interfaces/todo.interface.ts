/**
 * Данные по файлу, приложенному к задаче, необходимые для отображения в интерфейсе
 * @param {string} name - Имя файла
 * @param {string | undefined} link - Ссылка для открытия файла
 */
export interface IFileData {
	name: string
	link: string | undefined
}

/**
 * Данные по задаче
 * @param {string} id - Идентификатор задачи (присваивается при регистрации задачи в Firebase Realtime Database)
 * @param {string} title - Наименование задачи
 * @param {string} description - Описание задачи
 * @param {string} date - Дата
 * @param {IFileData[]} filedata - Набор файлов (имена и ссылки), прикрепленных к задаче
 * @param {boolean} completed - Статус выполнения задачи
 */
export interface ITodo {
	id: string
	title: string
	description: string
	date: string
	filedata: IFileData[]
	completed: boolean
}