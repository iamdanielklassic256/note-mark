import { ComponentProps } from 'react'
import DeleteNoteButton from './Button/DeleteNoteButton'
import NewNoteButton from './Button/NewNoteButton'

const ActionButtonsRow = ({ ...props }: ComponentProps<'div'>) => {
	return (
		<div {...props}>
			<NewNoteButton />
			<DeleteNoteButton />
		</div>
	)
}

export default ActionButtonsRow