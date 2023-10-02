import { RecoilRoot, SetterOrUpdater } from "recoil";
import RecoilNexus from "recoil-nexus";
import { DrawingAreaState, IMImage, LabelMappings, LoaderSpinner } from "../models/Types";
import { ReactNode, useEffect, useRef, useState } from "react";
import DrawingAreaAnnotation from "../screens/DrawingAreaAnnotation/DrawingAreaAnnotation";
import { DrawingAreaEditor } from "../models/DrawingAreaModels/DrawingAreaEditor";
import ImageLoader from "../components/Loader/ImageLoader";

interface IProps {
  drawingAreaState: DrawingAreaState
  labelMappings: LabelMappings
  editorSpacingLeft?: number
  editorSpacingTop?: number
  uploadRequest: (data: FormData, onProgress: (percent: number) => void) => Promise<IMImage>
  onUploadSubmit: (imImages: IMImage[]) => Promise<void>
}

export default function useDrawingAreaAnnotator(): [ReactNode, (config: IProps) => any, (imImage: IMImage) => void, () => any, SetterOrUpdater<LoaderSpinner>] {
    const [editor, setEditor] = useState<DrawingAreaEditor | null>(null);
    const editorRef = useRef<DrawingAreaEditor | null>(null)
    const [props, setProps] = useState<IProps | null>(null)
    const [loader,setLoader] = useState<LoaderSpinner>({visible: false})

    const init = (config: IProps) => {
      if(props) return;
      setProps(config)
    }

    useEffect(()=>{
        (async(e)=>{
          if(!props) return;
          const editor = new DrawingAreaEditor({
            container: 'drawing-area-editor',
            width: window.innerWidth - (props.editorSpacingLeft || 0),
            height: window.innerHeight - (props.editorSpacingTop || 0),
            spacingRight: 0,
            editorSpacingLeft: props.editorSpacingLeft,
            editorSpacingTop: props.editorSpacingTop
          });
          editorRef.current = editor;
          setEditor(editor);
    
          (window as any).editor = editor;
        })(editor)
        return () => {
          editorRef.current?.removeEventListeners();
        }
      },[props])

    const addNewImage = (imImage: IMImage) => {
      if(!editorRef.current) return;
      editorRef.current.addNewImage(imImage)
    }

    const handleSave = () => {
      if(!editorRef.current) return;
      const editorState = editorRef.current.exportDrawingAreaState()
      return editorState;
    }

    return [(
        <RecoilRoot>
            <RecoilNexus />
            <div style={{position: 'relative' }}>
                <div id={'drawing-area-editor'} style={{width: '100%', height: '100%'}}/>
                {(editor && props) ? <DrawingAreaAnnotation {...props} loader={loader} editor={editor} /> : <div style={{height: 'calc(100vh - 100px)'}}><ImageLoader spacingRight={300} forceShow/></div>}
            </div>
        </RecoilRoot>
    ), init, addNewImage, handleSave, setLoader]
}