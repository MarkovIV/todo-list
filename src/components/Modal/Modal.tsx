import { ModalProps } from './Modal.props'
import styles from './Modal.module.css'
import cn from 'classnames'

export const Modal = ({ children, onClose, className, ...props }: ModalProps): JSX.Element => {
	
	return (
		<>
			<div className={cn(className, styles.modal)} onClick={onClose} {...props}>
				{children}
			</div>	
		</>
	)		
}