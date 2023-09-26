import { useEffect, useRef } from "react";
import { useSetRecoilState } from "recoil";
import { loaderAtom } from "../../state/editor";
import AnnotationPopup from "../../components/AnnotationPopup/AnnotationPopup";
import Toolbar from "../../components/Toolbar/Toolbar";
import ImageLoader from "../../components/Loader/ImageLoader";
import { GraphJSON, HumanAnnotations, LabelMappings } from "../../models/Types";
import { graphToCOCOObj, humanToCOCOObj } from "../../utils/utils";
import "../../styles/global.scss"
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import { HumanAnnotationEditor } from "../../models/HumanAnnotationModels/HumanAnnotationEditor";

interface IProps {
    humanAnnotations: HumanAnnotations
    graphJSON: GraphJSON
    labelMappings: LabelMappings
    imageSrc: string,
    editorSpacingLeft?: number
    editorSpacingTop?: number
    editor: HumanAnnotationEditor
}

export default function HumanAnnotation({editor, imageSrc, humanAnnotations, graphJSON, labelMappings}: IProps) {
  const setLoader = useSetRecoilState(loaderAtom)
  const cursorTextRef = useRef<HTMLSpanElement>(null)

  useEffect(()=>{
    async function initEditor() {
      if(!editor || !cursorTextRef.current) return;
      editor.setCursorTextElement(cursorTextRef)
      editor.container().focus()
      setLoader({visible: true, title: "Loading editor..."})
      try {
        const hAnnotations = humanToCOCOObj(humanAnnotations);
        const mAnnotations = graphToCOCOObj(graphJSON,labelMappings, imageSrc)
        mAnnotations.annotations = [...mAnnotations.annotations, ...hAnnotations]
        await editor.importCOCOObj(mAnnotations)
      } catch (error) {
        console.log(error)
      }
      setLoader({visible: false})
    }
    initEditor()
  },[editor, humanAnnotations, cursorTextRef, graphJSON, labelMappings])

  return (
    <>
      <span ref={cursorTextRef} style={{position: 'absolute',fontFamily: 'Roboto', fontSize: 12,zIndex: 9999,color: 'white', backgroundColor: 'black',borderRadius: 10, padding: '3px 6px', fontStyle: 'bold'}} />
      <AnnotationPopup editor={editor}/>
      <LeftSidebar editor={editor}/>
      <Toolbar editor={editor} style={{left: 10, right: 'auto'}}/>
      <ImageLoader spacingRight={300}/>
    </>
  )
}