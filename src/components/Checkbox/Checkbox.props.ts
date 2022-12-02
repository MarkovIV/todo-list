import { DetailedHTMLProps, HTMLAttributes } from 'react'

export interface CheckboxProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>{
	completed: boolean
	setCompl?: () => void
}