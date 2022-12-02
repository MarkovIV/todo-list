import { ITodo } from '../interfaces/todo.interface'
import dayjs from 'dayjs'

/**
 * Функция для сортировки файлов, приложенных к задаче. Функция
 * используется для определения порядка отображения файлов в перечне файлов,
 * приложенных к задаче.
 * @param {string} fileName1 - Имя файла №1
 * @param {string} fileName2 - Имя файла №2
 * @returns {number} - Числовое значение для применения в методе sort массива
 */
export const sortFileNames = (fileName1: string, fileName2: string) => {
	if (fileName1 < fileName2) {
		return -1
	} else if (fileName1 > fileName2) {
		return 1
	} else {
		return 0
	}
}

/**
 * Функция для сортировки массива задач. Функция возвращает массив
 * задач, в котором задачи отсортированы в порядке возрастания даты.
 * @param {ITodo} todo1 - Задача №1
 * @param {ITodo} todo2 - Задача №2
 * @returns {number} - Числовое значение для применения в методе sort массива
 */
export const sortTodos = (todo1: ITodo, todo2: ITodo) => {
	if (dayjs(todo1.date).isBefore(dayjs(todo2.date).subtract(1, 'day'))) {
		return -1
	} else if (dayjs(todo2.date).isBefore(dayjs(todo1.date).subtract(1, 'day'))) {
		return 1
	} else {
		return 0
	}
}