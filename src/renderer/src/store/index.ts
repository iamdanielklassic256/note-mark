import { NoteContent, NoteInfo } from "@shared/models";
import { atom } from "jotai";
import { unwrap } from 'jotai/utils';

const loadNotes = async () => {
	const notes = await window.context.getNotes();

	// sort them in recent updates
	return notes.sort((a, b) => b.lastEdit - a.lastEdit)

}

const notesAtomAsync = atom<NoteInfo[] | Promise<NoteInfo[]>>(loadNotes())

export const notesAtom = unwrap(notesAtomAsync, (prev) => prev)
export const selectedNoteIndexAtom = atom<number | null>(null);

export const selectedNoteAtomAsync = atom(async (get) => {
	const notes = get(notesAtom);
	const selectedNoteIndex = get(selectedNoteIndexAtom);

	if (selectedNoteIndex == null || !notes) return null;

	const selectedNote = notes[selectedNoteIndex]


	const noteContent = await window.context.readNote(selectedNote.title)
	return {
		...selectedNote,
		content: noteContent
	}
})
export const selectedNoteAtom = unwrap(
	selectedNoteAtomAsync,
	(prev) =>
		prev ?? {
			title: '',
			content: '',
			lastEditTime: Date.now()
		}
)

export const saveNoteAtom = atom(null, async (get, set, newContent: NoteContent) => {
	const notes = get(notesAtom)
	const selectedNote = get(selectedNoteAtom)

	if (!selectedNote || !notes) return

	// save on disk
	await window.context.writeNote(selectedNote.title, newContent)

	// update the saved note's last edit time
	set(
		notesAtom,
		notes.map((note) => {
			// this is the note that we want to update
			if (note.title === selectedNote.title) {
				return {
					...note,
					lastEditTime: Date.now()
				}
			}

			return note
		})
	)
})

export const createNewNoteAtom = atom(null, (get, set) => {
	const notes = get(notesAtom)

	if (!notes) return

	const title = `Note ${notes.length + 1}`;
	const newNote: NoteInfo = {
		title,
		lastEdit: Date.now()
	}

	set(notesAtom, [newNote, ...notes.filter((note) => note.title !== newNote.title)])
	set(selectedNoteIndexAtom, 0)
})


export const deleteNoteAtom = atom(null, async (get, set) => {
	const notes = get(notesAtom)
	const selectedNote = get(selectedNoteAtom)

	if (!selectedNote || !notes) return

	const isDeleted = await window.context.deleteNote(selectedNote.title)

	if (!isDeleted) return

	// filter out the deleted note
	set(
		notesAtom,
		notes.filter((note) => note.title !== selectedNote.title)
	)

	// de select any note
	set(selectedNoteIndexAtom, null)
})