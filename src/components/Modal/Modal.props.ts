import { DetailedHTMLProps, HTMLAttributes } from 'react'

export interface ModalProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>{
	children?: React.ReactNode
	onClose?: () => void
}