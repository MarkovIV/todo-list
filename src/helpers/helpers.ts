/**
 * Функция для сортировки файлов, приложенных к задаче. Функция
 * используется для определения порядка отображения файлов в перечне файлов,
 * приложенных к задаче
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