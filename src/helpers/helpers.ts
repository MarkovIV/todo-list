export const sortFileNames = (fileName1: string, fileName2: string) => {
	if (fileName1 < fileName2) {
		return -1
	} else if (fileName1 > fileName2) {
		return 1
	} else {
		return 0
	}
}