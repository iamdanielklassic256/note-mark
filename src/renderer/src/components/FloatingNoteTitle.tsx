import { selectedNoteAtom } from '@renderer/store'
import { useAtomValue } from 'jotai'
import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

const FloatingNoteTitle = ({ className, ...props }: ComponentProps<'div'>) => {
	const selectedNote = useAtomValue(selectedNoteAtom)

	if (!selectedNote) return null


	// console.log('.....selected note', selectedNote)
	return (
		<div className={twMerge('flex justify-center', className)} {...props}>
			<span className='text-gray-400 '>{selectedNote?.title}</span>
		</div>
	)
}

export default FloatingNoteTitle