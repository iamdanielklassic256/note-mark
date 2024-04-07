import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'
import NotePreview from './NotePreview'
import { useNotesList } from '@renderer/hooks/useNotesList'


export type NotePreviewListProps = ComponentProps<'ul'> & {
	onSelect?: () => void
}

const NotePreviewList = ({ onSelect, className, ...props }: NotePreviewListProps) => {

	const { notes, handleNoteSelect, selectedNoteIndex } = useNotesList({onSelect});

	if(!notes) return null
	if (notes.length === 0) {
		return (
			<ul className={twMerge('text-center pt-8', className)}>
				<span>No Notes Yet😢😢</span>
			</ul>
		)
	}
	// console.log("notes....", notes)
	return (
		<ul {...props} className={twMerge('', className)}>
			{notes.map((note, index) => (
				<NotePreview
					key={note.title + note.lastEdit}
					isActive={selectedNoteIndex === index}
					onClick={handleNoteSelect(index)}
					{...note}
				/>
			))}
		</ul>
	)
}

export default NotePreviewList