import DraggableTopBar from "@/components/DraggableTopBar";
import { useRef } from "react";
import { FaRegTrashCan } from "react-icons/fa6";
import { LuFileSignature } from "react-icons/lu";
import { Content, RootLayout, SideBar } from "./components";
import FloatingNoteTitle from "./components/FloatingNoteTitle";
import MarkDown from "./components/MarkDown";
import NotePreviewList from "./components/NotePreviewList";
import { useSetAtom } from "jotai";
import { createNewNoteAtom, deleteNoteAtom } from "./store";

const App = () => {
  const contentContainerRef = useRef<HTMLDivElement>(null)

  const resetScroll = () => {
    contentContainerRef.current?.scrollTo(0, 0)
  }
  const createNewNote = useSetAtom(createNewNoteAtom)
  const deleteNote = useSetAtom(deleteNoteAtom)

	const handleCreation = () => {
		createNewNote()

	}
  

	const handleRemoval = () => {
		deleteNote()

	}
  return (
    <>
      <DraggableTopBar />
      <RootLayout>
        <SideBar className="p-2">
          {/* <ActionButtonsRow className="flex justify-between mt-1" /> */}
          <div>
            <div className="flex justify-between mt-1">
              <div className="cursor-pointer" onClick={handleCreation}>
                <LuFileSignature className='w-4 h-4 text-zinc-300  ' />
              </div>
              <div className="cursor-pointer" onClick={deleteNote}>
                <FaRegTrashCan className='w-4 h-4 text-zinc-300 ' />
              </div>

            </div>
          </div>
          <NotePreviewList className="mt-3 space-y-1" onSelect={resetScroll} />
        </SideBar>
        <Content ref={contentContainerRef} className="border-l  bg-zinc-900/50 border-l-white/20">
          <FloatingNoteTitle className="pt-2" />
          <MarkDown />
        </Content>
      </RootLayout>
    </>
  );
}

export default App;