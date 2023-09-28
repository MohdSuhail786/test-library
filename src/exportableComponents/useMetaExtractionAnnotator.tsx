import { RecoilRoot, SetterOrUpdater } from "recoil";
import RecoilNexus from "recoil-nexus";
import { MetaSelectionState, IMImage, LabelMappings, LoaderSpinner } from "../models/Types";
import { ReactNode, useEffect, useRef, useState } from "react";
import ImageLoader from "../components/Loader/ImageLoader";
import { MetaSelectionEditor } from "../models/MetaSelectionModels/MetaSelectionEditor";
import MetaSelectionAnnotation from "../screens/MetaSelectionAnnotation/MetaSelectionAnnotation";

interface IProps {
  metaExtractionState: MetaSelectionState
  labelMappings: LabelMappings
  editorSpacingLeft?: number
  editorSpacingTop?: number
  uploadRequest: (data: FormData, onProgress: (percent: number) => void) => Promise<IMImage>
  onUploadSubmit: (imImages: IMImage[]) => Promise<void>
}

export default function useMetaExtractionAnnotator(): [ReactNode, (config: IProps) => any, () => any, SetterOrUpdater<LoaderSpinner>] {
    const [editor, setEditor] = useState<MetaSelectionEditor | null>(null);
    const editorRef = useRef<MetaSelectionEditor | null>(null)
    const [props, setProps] = useState<IProps | null>(null)
    const [loader,setLoader] = useState<LoaderSpinner>({visible: false})

    const init = (config: IProps) => {
      if(props) return;
      setProps(config)
    }

    useEffect(()=>{
        (async(e)=>{
          if(!props) return;
          const editor = new MetaSelectionEditor({
            container: 'meta-selection-area-editor',
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

    const handleSave = () => {
      if(!editorRef.current) return;
      const editorState = editorRef.current.exportMetaSelectionState()
      return editorState;
    }

    return [(
        <RecoilRoot>
            <RecoilNexus />
            <div style={{position: 'relative' }}>
                <div id={'meta-selection-area-editor'} style={{width: '100%', height: '100%'}}/>
                {(editor && props) ? <MetaSelectionAnnotation {...props} loader={loader} editor={editor} /> : <div style={{height: 'calc(100vh - 100px)'}}><ImageLoader spacingRight={300} forceShow/></div>}
            </div>
        </RecoilRoot>
    ), init, handleSave, setLoader]
}