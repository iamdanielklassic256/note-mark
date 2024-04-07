import React from 'react'
import ActionButton, { ActionButtonProps } from './ActionButton'
import { LuFileSignature } from 'react-icons/lu'
import { useSetAtom } from 'jotai'
import { createNewNoteAtom } from '@renderer/store'

const NewNoteButton = ({...props}: ActionButtonProps) => {
	const createNewNote = useSetAtom(createNewNoteAtom)

	const handleCreation = () => {
		createNewNote()

	}
  return (
	<ActionButton onClick={handleCreation}  {...props} >
		<LuFileSignature className='w-4 h-4 text-zinc-300 '/>
	</ActionButton>
  )
}

export default NewNoteButton