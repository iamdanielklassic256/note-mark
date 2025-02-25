import { deleteNoteAtom } from '@renderer/store'
import { useSetAtom } from 'jotai'
import { FaRegTrashCan } from 'react-icons/fa6'
import ActionButton, { ActionButtonProps } from './ActionButton'

const DeleteNoteButton = ({ ...props }: ActionButtonProps) => {
	const deleteNote = useSetAtom(deleteNoteAtom)

	const handleRemoval = () => {
		deleteNote()

	}
	return (
		<ActionButton onClick={handleRemoval}  {...props} >
			<FaRegTrashCan className='w-4 h-4 text-zinc-300 ' />
		</ActionButton>
	)
}
export default DeleteNoteButton