import { RecoilRoot } from "recoil";
import RecoilNexus from "recoil-nexus";
import { GraphJSON, HumanAnnotations, LabelMappings } from "../models/Types";
import HumanAnnotation from "../screens/HumanAnnotation/HumanAnnotation";
import { ReactNode, useEffect, useRef, useState } from "react";
import { groupArrayInPairs } from "../utils/utils";
import { HumanAnnotationEditor } from "../models/HumanAnnotationModels/HumanAnnotationEditor";

interface IProps {
  humanAnnotations: HumanAnnotations
  graphJSON: GraphJSON
  labelMappings: LabelMappings
  imageSrc: string
  editorSpacingLeft?: number
  editorSpacingTop?: number
}

export default function useHumanAnnotator(): [ReactNode, (config: IProps) => any, () => any] {
    const [editor, setEditor] = useState<HumanAnnotationEditor | null>(null);
    const editorRef = useRef<HumanAnnotationEditor | null>(null)
    const [props, setProps] = useState<IProps | null>(null)

    const init = (config: IProps) => {
      if(props) return;
      setProps(config)
    }

    useEffect(()=>{
        (async(e)=>{
          if(e || !props) return;
          const editor = new HumanAnnotationEditor({
            container: 'ha-editor',
            width: window.innerWidth - (props.editorSpacingLeft || 0),
            height: window.innerHeight - (props.editorSpacingTop || 0),
            spacingRight: 300,
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
        try {
          if(!editor || !props) return {humanGraphJSON: null,machineGraphJSON: null};
            let GraphJSON = {
              area: { ...props.graphJSON.area },
              bbox: { ...props.graphJSON.bbox },
              category_id: { ...props.graphJSON.category_id },
              category_name: { ...props.graphJSON.category_name },
              direction: { ...props.graphJSON.direction },
              score: { ...props.graphJSON.score },
              oldbbox: { ...props.graphJSON.old_bbox },
              newbbox: { ...props.graphJSON.newbbox },
              text: { ...props.graphJSON.text },
            }
      
            let humanCOCO:any[] = []
            let machineCOCO:any[] = []
      
            editor?.activeImage?.entities.forEach(entity => {
              const category = props.labelMappings.find(category => category.name === entity.label?.name)
              if(!category) return;
              if(!entity.humanAnnotated && !!GraphJSON.bbox[entity.indexId]) {
                let annotation = {
                  category_name: category.name,
                  category_id: category.id,
                  bbox: [entity.x(), entity.y(), entity.rect.width(), entity.rect.height()],
                  direction: entity.direction,
                  score: GraphJSON.score[entity.indexId],
                  area: GraphJSON.area[entity.indexId],
                  newbbox: GraphJSON.newbbox[entity.indexId],
                  oldbbox: GraphJSON.oldbbox[entity.indexId],
                  text: GraphJSON.text[entity.indexId],
                }
                machineCOCO.push(annotation)
              } else if(entity.humanAnnotated) {
                let annotation = {
                  category_name: category.name,
                  direction: entity.direction,
                  category_id: category.id,
                  bbox: [entity.x(), entity.y(), entity.rect.width(), entity.rect.height()],
                  score: 1,
                  iscrowd: 0,
                  segmentation: [],
                  image_id: 0,
                  area: 0,
                }
      
                humanCOCO.push(annotation)
              }
            })
      
            editor?.activeImage?.texts.forEach(text => {
              const category = props.labelMappings.find(category => category.name === text.label?.name)
              if(!category) return;
              if(!text.humanAnnotated && !!GraphJSON.bbox[text.indexId]) {
                let annotation = {
                  category_name: category.name,
                  category_id: category.id,
                  bbox: [text.x(), text.y(), text.rect.width(), text.rect.height()],
                  direction: text.direction,
                  score: GraphJSON.score[text.indexId],
                  area: GraphJSON.area[text.indexId],
                  newbbox: GraphJSON.newbbox[text.indexId],
                  oldbbox: GraphJSON.oldbbox[text.indexId],
                  text: GraphJSON.text[text.indexId],
                }
                machineCOCO.push(annotation)
              } else if(text.humanAnnotated) {
                let annotation = {
                  category_name: category.name,
                  direction: text.direction,
                  category_id: category.id,
                  bbox: [text.x(), text.y(), text.rect.width(), text.rect.height()],
                  score: 1,
                  iscrowd: 0,
                  segmentation: [],
                  image_id: 0,
                  area: 0,
                }
      
                humanCOCO.push(annotation)
              }
            })
            let humanGraphArray = {
              bbox: [] as any[],
              category_id: [] as any[],
              category_name: [] as any[],
              direction: [] as any[],
              score: [] as any[],
              area: [] as any[],
              text: [] as any[]
            }
            humanCOCO.forEach((annotation:any) => {
              humanGraphArray.bbox.push(annotation.bbox)
              humanGraphArray.category_id.push(annotation.category_id)
              humanGraphArray.category_name.push(annotation.category_name)
              humanGraphArray.direction.push(annotation.direction)
              humanGraphArray.score.push(annotation.score)
              humanGraphArray.text.push((annotation.category_name as string).toUpperCase() === "TEXT" ? "" : null)
            })
      
            let humanGraphJSON = {
              bbox: { ...humanGraphArray.bbox },
              category_id: { ...humanGraphArray.category_id },
              category_name: { ...humanGraphArray.category_name },
              direction: { ...humanGraphArray.direction },
              score: { ...humanGraphArray.score },
              text: { ...humanGraphArray.text },
              polygon: {...[...editor.activeImage?.polygons || []].map(polygon => ({
                category_name: polygon.label?.name || "",
                category_id: props.labelMappings.find(category => category.name === polygon.label?.name)?.id,
                contour: groupArrayInPairs(polygon.line.points()),
                direction: polygon.direction
              }))},
            }
      
            let machineGraphArray = {
              category_name: [] as any[],
              category_id: [] as any[],
              bbox: [] as any[],
              direction: [] as any[],
              score: [] as any[],
              area: [] as any[],
              newbbox: [] as any[],
              oldbbox: [] as any[],
              text: [] as any[],
            }
      
            machineCOCO.forEach(annotation => {
              machineGraphArray.category_name.push(annotation.category_name);
              machineGraphArray.category_id.push(annotation.category_id);
              machineGraphArray.bbox.push(annotation.bbox);
              machineGraphArray.direction.push(annotation.direction);
              machineGraphArray.score.push(annotation.score);
              machineGraphArray.area.push(annotation.area);
              machineGraphArray.newbbox.push(annotation.newbbox);
              machineGraphArray.oldbbox.push(annotation.oldbbox);
              machineGraphArray.text.push(annotation.text);
            })
      
            let machineGraphJSON = {
              category_name: { ...machineGraphArray.category_name },
              category_id: { ...machineGraphArray.category_id },
              bbox: { ...machineGraphArray.bbox },
              direction: { ...machineGraphArray.direction },
              score: { ...machineGraphArray.score },
              area: { ...machineGraphArray.area },
              newbbox: { ...machineGraphArray.newbbox },
              old_bbox: { ...machineGraphArray.oldbbox },
              text: { ...machineGraphArray.text },
            }
      
            return {humanGraphJSON,machineGraphJSON}
          } catch (error) {
            console.log(error)
            return {humanGraphJSON: null,machineGraphJSON: null};
          }
    }

    return [(
        <RecoilRoot>
            <RecoilNexus />
            <div style={{position: 'relative'}}>
                <div id={'ha-editor'} style={{width: '100%', height: '100%'}}/>
                {editor && props && <HumanAnnotation {...props} editor={editor} />}
            </div>
        </RecoilRoot>
    ), init, handleSave]
}