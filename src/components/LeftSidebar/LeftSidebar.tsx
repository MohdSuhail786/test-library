import styles from "./LeftSidebar.module.scss";
import { FiSearch } from 'react-icons/fi';
import { Checkbox, Empty, Input } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import AnnotationInput from "../AnnotationInput/AnnotationInput";
import { AnnotationType, EditorTypes, Filter } from "../../models/Types";
import { Box } from "../../models/Box";
import { Polygon } from "../../models/Polygon";
import { entityListAtom, polygonListAtom, textListAtom } from "../../state/editor";
import { ViewportList, ViewportListRef } from "react-viewport-list";
import { debounce } from "lodash";

interface IProps {
    editor: EditorTypes
    config?: {
        showInput?: boolean,
        showCheckBoxes?: boolean,
        showDirection?: boolean,
        allowLabelUpdate?: boolean
    }
}

export default function LeftSidebar({editor,config={showInput: true,showCheckBoxes: true, showDirection: true, allowLabelUpdate: true}}: IProps) {

    const entities = useRecoilValue(entityListAtom)
    const polygons = useRecoilValue(polygonListAtom)
    const texts = useRecoilValue(textListAtom)
    const ref = useRef<ViewportListRef>(null)

    const [filter,setFilter] = useState<Filter>(editor.filter)
    const [renderedAnnotations, setRenderedAnnotations] = useState<(Box | Polygon)[]>([])

    const reRenderAnnotations = useCallback(debounce((editor,filter)=>{
        editor.updateFilter(filter);
        editor.renderAnnotations();
    }),[])

    useEffect(() => {
        editor.listContainerRef = ref
    },[ref])

    useEffect(()=>{
        reRenderAnnotations(editor,filter)
    },[filter])

    useEffect(()=>{
        switch(filter.annotationType) {
            case "entity":
                setRenderedAnnotations([...entities.filter(entity => (entity.label?.name || "").toLocaleLowerCase().includes(filter.entityClass.toLocaleLowerCase()))]);
                break;
            case "polygon":
                setRenderedAnnotations([...polygons.filter(polygon => (polygon.label?.name || "").toLocaleLowerCase().includes(filter.entityClass.toLocaleLowerCase()))]);
                break;
            case "text":
                setRenderedAnnotations(texts);
                break;
        }
    },[filter, entities, polygons, texts])
    
    return (
        <>
            <div className={styles["left-sidebar"]}>
                <div className={styles['selector-container']} style={!config.showInput ? {padding: 0} : {}}>
                    {config.showInput && <Input
                        className={styles['search-entity-class']}
                        placeholder='Search...'
                        disabled={filter.annotationType === 'text'}
                        size='large'
                        value={filter.entityClass}
                        onChange={(e) => setFilter(prev => ({...prev,entityClass: e.target.value}))}
                        prefix={<><FiSearch color='#B2B2B5' size={20}/> &nbsp;</>}
                    />}
                    {config.showCheckBoxes && <Checkbox.Group className={styles["annotation-type-selector"]} value={[filter.annotationType]} onChange={(value) => {
                        setFilter(prev => ({...prev,annotationType: value.find(v => v!==prev.annotationType) as AnnotationType || prev.annotationType}))
                    }} options={[
                        {label: <div className={styles['entity-class-filter-item']}><span>Entity</span></div>,value: 'entity'},
                        {label: <div className={styles['entity-class-filter-item']}><span>Polygon</span></div>,value: 'polygon'},
                        {label: <div className={styles['entity-class-filter-item']}><span>Text</span></div>,value: 'text'},
                    ]}/>}
                </div>
                {
                    renderedAnnotations.length ? <div className={styles["label-input-list-container"]} >
                        <ViewportList
                            ref={ref}
                            // viewportRef={ref}
                            items={renderedAnnotations.sort((a,b) => a._id - b._id).map((shape,i) => {shape.setAttr('virtualIndex',i); return shape;})}
                        >
                            {(shape,index) => (<AnnotationInput key={shape._id} index={index} editor={editor} shape={shape} showDirection={config.showDirection} allowLabelUpdate={config.allowLabelUpdate}/> )}
                        </ViewportList>
                    </div>
                    : 
                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
                        <Empty style={{flex: 1}} image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    </div>    
                }
            </div>
        </>
    )
}