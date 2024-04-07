// import { fileEncoding } from "@shared/constants"
import { NoteInfo } from "@shared/models"
import { CreateNote, DeleteNote, GetNotes, WriteNote } from "@shared/types"
import { dialog } from "electron"
import { ensureDir, readFile, readdir, remove, stat, writeFile } from "fs-extra"
import { homedir } from "os"
import path from "path"

export const getRootDir = () => {
	return `${homedir()}/NoteMark`
}

export const getNotes: GetNotes = async () => {
	const rootDir = getRootDir()

	await ensureDir(rootDir)

	const notesFileName = await readdir(rootDir, {
		encoding: 'utf8',
		withFileTypes: false
	})
	const notes = notesFileName.filter((fileName) => fileName.endsWith('.md'))

	return Promise.all(notes.map(getNotesFromFilename))
}

export const getNotesFromFilename = async (filename: string): Promise<NoteInfo> => {
	const fileStats = await stat(`${getRootDir()}/${filename}`)

	return {
		title: filename.replace(/\.md$/, ''),
		lastEdit: fileStats.mtimeMs
	}
}

export const readNotes = async (filename: string) => {
	const rootDir = getRootDir();
	return readFile(`${rootDir}/${filename}.md`, { encoding: 'utf8' })
}

export const writeNote: WriteNote = async (filename, content) => {
	const rootDir = getRootDir()

	console.info(`Writing note ${filename}`)
	return writeFile(`${rootDir}/${filename}.md`, content, { encoding: 'utf8' })
}

export const createNote: CreateNote = async () => {
	const rootDir = getRootDir()

	await ensureDir(rootDir)

	const { filePath, canceled } = await dialog.showSaveDialog({
		title: 'New note',
		defaultPath: `${rootDir}/Untitled.md`,
		buttonLabel: 'Create',
		properties: ['showOverwriteConfirmation'],
		showsTagField: false,
		filters: [{ name: 'Markdown', extensions: ['md'] }]
	})

	if (canceled || !filePath) {
		console.info('Note creation canceled')
		return false
	}

	const { name: filename, dir: parentDir } = path.parse(filePath)

	if (parentDir !== rootDir) {
		await dialog.showMessageBox({
			type: 'error',
			title: 'Creation failed',
			message: `All notes must be saved under ${rootDir}.
		Avoid using other directories!`
		})

		return false
	}

	console.info(`Creating note: ${filePath}`)
	await writeFile(filePath, '')

	return filename
}

export const deleteNote: DeleteNote = async (filename) => {
	const rootDir = getRootDir()

	const { response } = await dialog.showMessageBox({
		type: 'warning',
		title: 'Delete note',
		message: `Are you sure you want to delete ${filename}?`,
		buttons: ['Delete', 'Cancel'], // 0 is Delete, 1 is Cancel
		defaultId: 1,
		cancelId: 1
	})

	if (response === 1) {
		console.info('Note deletion canceled')
		return false
	}

	console.info(`Deleting note: ${filename}`)
	await remove(`${rootDir}/${filename}.md`)
	return true
}