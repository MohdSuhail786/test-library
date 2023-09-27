import { useEffect, useRef } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { loaderAtom, showUploadDraggerAtom } from "../../state/editor";
import AnnotationPopup from "../../components/AnnotationPopup/AnnotationPopup";
import Toolbar from "../../components/Toolbar/Toolbar";
import ImageLoader from "../../components/Loader/ImageLoader";
import { IMImage, LabelMappings, LoaderSpinner, MetaSelectionState } from "../../models/Types";
import "../../styles/global.scss"
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import UploadDragger from "../../components/UploadDragger/UploadDragger";
import { MetaSelectionEditor } from "../../models/MetaSelectionModels/MetaSelectionEditor";

interface IProps {
    metaExtractionState: MetaSelectionState
    labelMappings: LabelMappings
    editorSpacingLeft?: number
    editorSpacingTop?: number
    editor: MetaSelectionEditor
    uploadRequest: (data: FormData, onProgress: (percent: number) => void) => Promise<IMImage>
    onUploadSubmit: (imImages: IMImage[]) => Promise<void>
    loader: LoaderSpinner
}

export default function MetaSelectionAnnotation({editor, labelMappings, metaExtractionState, loader, editorSpacingLeft, uploadRequest, onUploadSubmit}: IProps) {
  const setLoader = useSetRecoilState(loaderAtom)
  const [showUploadDragger, setShowUploadDragger] = useRecoilState(showUploadDraggerAtom)
  const cursorTextRef = useRef<HTMLSpanElement>(null)

  useEffect(()=>{
    async function initEditor() {
      if(!editor || !cursorTextRef.current) return;
      editor.setCursorTextElement(cursorTextRef)
      editor.container().focus()
      setLoader({visible: true, title: "Loading editor..."})
      try {
        await editor.importMetaSelectionState(metaExtractionState, labelMappings)
      } catch (error) {
        console.log(error)
      }
      if(editor.images.length === 0) {
        setShowUploadDragger(true)
      }
      setLoader({visible: false})
    }
    initEditor()
    return () => {
      setShowUploadDragger(false)
    }
  },[editor, cursorTextRef, labelMappings, metaExtractionState])

  useEffect(()=>{
    setLoader(loader)
  },[loader])

  return (
    <>
      {showUploadDragger && <UploadDragger editor={editor} spacingLeft={editorSpacingLeft} uploadRequest={uploadRequest} onUploadSubmit={onUploadSubmit}/>}
      <span ref={cursorTextRef} style={{position: 'absolute',fontFamily: 'Roboto', fontSize: 12,zIndex: 9999,color: 'white', backgroundColor: 'black',borderRadius: 10, padding: '3px 6px', fontStyle: 'bold'}} />
      <AnnotationPopup editor={editor} showDirection={false} allowLabelUpdate={true} allowCustomLabels={true}/>
      <LeftSidebar editor={editor} config={{showInput: false,showCheckBoxes: false,showDirection: false, allowLabelUpdate: true}}/>
      <Toolbar editor={editor} style={{left: 10, right: 'auto'}}/>
      <ImageLoader spacingRight={300}/>
    </>
  )
}