import { useEffect, useRef } from "react";
import { useSetRecoilState } from "recoil";
import { loaderAtom } from "../../state/editor";
import AnnotationPopup from "../../components/AnnotationPopup/AnnotationPopup";
import Toolbar from "../../components/Toolbar/Toolbar";
import ImageLoader from "../../components/Loader/ImageLoader";
import { DrawingAreaState, LabelMappings } from "../../models/Types";
import "../../styles/global.scss"
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import { DrawingAreaEditor } from "../../models/DrawingAreaModels/DrawingAreaEditor";

interface IProps {
    drawingAreaState: DrawingAreaState
    labelMappings: LabelMappings
    editorSpacingLeft?: number
    editorSpacingTop?: number
    editor: DrawingAreaEditor
}

export default function DrawingAreaAnnotation({editor, labelMappings, drawingAreaState}: IProps) {
  const setLoader = useSetRecoilState(loaderAtom)
  const cursorTextRef = useRef<HTMLSpanElement>(null)

  useEffect(()=>{
    async function initEditor() {
      if(!editor || !cursorTextRef.current) return;
      editor.setCursorTextElement(cursorTextRef)
      editor.container().focus()
      setLoader({visible: true, title: "Loading editor..."})
      try {
        await editor.importDrawingAreaState(drawingAreaState, labelMappings)
      } catch (error) {
        console.log(error)
      }
      setLoader({visible: false})
    }
    initEditor()
  },[editor, cursorTextRef, labelMappings, drawingAreaState])

  return (
    <>
      <span ref={cursorTextRef} style={{position: 'absolute',fontFamily: 'Roboto', fontSize: 12,zIndex: 9999,color: 'white', backgroundColor: 'black',borderRadius: 10, padding: '3px 6px', fontStyle: 'bold'}} />
      <AnnotationPopup editor={editor} showDirection={false} allowLabelUpdate={false}/>
      <LeftSidebar editor={editor} config={{showInput: false,showCheckBoxes: false,showDirection: false, allowLabelUpdate: false}}/>
      <Toolbar editor={editor} style={{left: 10, right: 'auto'}}/>
      <ImageLoader spacingRight={300}/>
    </>
  )
}