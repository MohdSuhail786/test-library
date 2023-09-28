import { RecoilRoot, SetterOrUpdater } from "recoil";
import RecoilNexus from "recoil-nexus";
import { IMImage, LabelMappings, LoaderSpinner, LegendState } from "../models/Types";
import { ReactNode, useEffect, useRef, useState } from "react";
import ImageLoader from "../components/Loader/ImageLoader";
import { LegendEditor } from "../models/LegendAnnotationModels/LegendEditor";
import LegendAnnotation from "../screens/LegendAnnotation/LegendAnnotation";

interface IProps {
  legendState: LegendState
  labelMappings: LabelMappings
  editorSpacingLeft?: number
  editorSpacingTop?: number
  uploadRequest: (data: FormData, onProgress: (percent: number) => void) => Promise<IMImage>
  onUploadSubmit: (imImages: IMImage[]) => Promise<void>
  onImageRequest: (id: number) => Promise<string>
}

export default function useLegendAnnotator(): [ReactNode, (config: IProps) => any, () => any, SetterOrUpdater<LoaderSpinner>] {
    const [editor, setEditor] = useState<LegendEditor | null>(null);
    const editorRef = useRef<LegendEditor | null>(null)
    const [props, setProps] = useState<IProps | null>(null)
    const [loader,setLoader] = useState<LoaderSpinner>({visible: false})

    const init = (config: IProps) => {
      if(props) return;
      setProps(config)
    }

    useEffect(()=>{
        (async(e)=>{
          if(!props) return;
          const editor = new LegendEditor({
            container: 'legend-editor',
            width: window.innerWidth - (props.editorSpacingLeft || 0),
            height: window.innerHeight - (props.editorSpacingTop || 0),
            spacingRight: 0,
            editorSpacingLeft: props.editorSpacingLeft,
            editorSpacingTop: props.editorSpacingTop,
            onImageRequest: props.onImageRequest
          });
          editorRef.current = editor;
          setEditor(editor);
    
          (window as any).editor = editor;
        })(editor)
        return () => {
          editorRef.current?.removeEventListeners();
        }
      },[props])

    const handleSave = () => {
      if(!editorRef.current) return;
      const editorState = editorRef.current.exportLegendState()
      return editorState;
    }

    return [(
        <RecoilRoot>
            <RecoilNexus />
            <div style={{position: 'relative' }}>
                <div id={'legend-editor'} style={{width: '100%', height: '100%'}}/>
                {(editor && props) ? <LegendAnnotation {...props} loader={loader} editor={editor} /> : <div style={{height: '100vh'}}><ImageLoader spacingRight={300} forceShow/></div>}
            </div>
        </RecoilRoot>
    ), init, handleSave, setLoader]
}