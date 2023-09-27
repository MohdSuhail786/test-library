import { useRecoilValue } from "recoil"
import styles from "./AnnotationPopup.module.scss"
import {BiX} from "react-icons/bi"
import { appModeAtom, filterAtom, labelListAtom } from "../../state/editor";
import { RemoveBoxAction } from "../../actions/RemoveBoxAction";
import { IoMdReturnLeft } from "react-icons/io";
import { useEffect, useRef, useState } from "react";
import { Vector2d } from "konva/lib/types";
import ActionsStore from "../../actions/ActionStore";
import { Box } from "../../models/Box";
import { Polygon } from "../../models/Polygon";
import { RemovePolygonAction } from "../../actions/RemovePolygonAction";
import { Label } from "../../models/Label";
import { MdOutlineDirections } from "react-icons/md";
import { Dropdown } from "antd";
import { Direction, EditorTypes } from "../../models/Types";
import { directions } from "../../constants/Constants";

const padding = 10;
const modalWidthHeight = 320;

interface IProps {
    editor: EditorTypes
    matchEmptyString?: boolean
    allowCustomLabels?: boolean
    allowLabelUpdate?: boolean
    showDirection?: boolean
}

export default function AnnotationPopup({editor, matchEmptyString = false, allowCustomLabels = false, allowLabelUpdate = true, showDirection = true}: IProps) {
    const appMode = useRecoilValue(appModeAtom)
    const labels = useRecoilValue(labelListAtom)
    const filter = useRecoilValue(filterAtom)
    const [labelSearch, setLabelSearch] = useState({key:"", allowFilter: true})
    const [position, setPosition] = useState<Vector2d | null>(null);
    const [selectedLabel, setSelectedLabel] = useState<number | null>(null)
    const [matchLables, setMatchLables] = useState<Label[]>([])
    const [direction, setDirection] = useState((appMode as any)?.shapeInEditMode?.direction)
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const activeRef = useRef<HTMLSpanElement>(null);
    
    useEffect(()=>{
        if(!labelSearch.allowFilter || labels.length===0) return;
        const matchClasses = ((labelSearch.key) === "" && !matchEmptyString) ? [] : labels.filter(label => (textToHumanReadable(label.name || "")).includes(labelSearch.key.toUpperCase()));
        setMatchLables(matchClasses);
        setSelectedLabel(matchClasses.length ? 0 : null)
    },[labelSearch, labels])

    useEffect(()=>{
        if(!appMode || appMode.mode !== "EDIT_MODE") return;
        if(!appMode.visible) {
            setPosition(null);
            return;
        }
        const boxPosition = appMode.shapeInEditMode.getClientRect();
        const boxWidth = appMode.shapeInEditMode.getClientRect().width + padding;
    
        let x = boxPosition.x + boxWidth + modalWidthHeight > window.innerWidth ? boxPosition.x - modalWidthHeight : boxPosition.x + boxWidth
        let y = (boxPosition.y + modalWidthHeight) > window.innerHeight ? boxPosition.y - ((boxPosition.y + modalWidthHeight) - window.innerHeight) : boxPosition.y;
        x = x < 0 ? (editor.getPointerPosition()?.x || window.innerWidth/2) : x
        y = y < 0 ? (editor.getPointerPosition()?.y || window.innerHeight/2) : y
        setPosition({x,y})
    },[appMode])

    useEffect(()=>{
        if(appMode.mode === "EDIT_MODE" && inputRef.current) {
            setLabelSearch({key: textToHumanReadable(appMode.shapeInEditMode?.label?.name || ""), allowFilter: false});
            setDirection(appMode.shapeInEditMode.direction)
            setTimeout(() => {
                inputRef?.current?.select();
                inputRef?.current?.focus();
                return null;
            }, 200);
        }
    },[appMode])

    const updateLabel = (label: Label) => {
        if(appMode.mode !== "EDIT_MODE") return;
        appMode.shapeInEditMode.updateLabel(label);
    }

    useEffect(()=>{
        function keyDownEventHandler(event: KeyboardEvent) {
            if(!inputRef.current) return;
            if(event.key === 'Enter') {
                handleSave()
            } else if(event.key === "ArrowDown" && selectedLabel!== null) {
                event.preventDefault();
                const newSelectedLabel = (selectedLabel + 1) % matchLables.length
                setSelectedLabel(newSelectedLabel);
                setLabelSearch({key: textToHumanReadable(matchLables[newSelectedLabel].name), allowFilter: false});
            } else if(event.key === "ArrowUp" && selectedLabel!== null) {
                event.preventDefault();
                const newSelectedLabel = selectedLabel === 0 ? matchLables.length - 1 : selectedLabel - 1
                setSelectedLabel(newSelectedLabel);
                setLabelSearch({key: textToHumanReadable(matchLables[newSelectedLabel].name), allowFilter: false});
            } else if(event.key === 'Escape') {
                handleClose();
            }
        }
        document.addEventListener('keydown', keyDownEventHandler);
        return () => document.removeEventListener('keydown', keyDownEventHandler);
    }, [appMode, selectedLabel, matchLables])

    const scrollElementIntoViewWithinDiv = (element:Element, div:Element) => {
        const rect = element.getBoundingClientRect();
        const divRect = div.getBoundingClientRect();
        if (
          rect.top < divRect.top ||
          rect.bottom > divRect.bottom
        ) {
          element.scrollIntoView({
            block: 'nearest'
          });
        }
    }

    useEffect(()=>{
        if(selectedLabel === null) return;
        const span = activeRef.current;
        const parent = listRef.current
        if(!span || !parent) return;
        scrollElementIntoViewWithinDiv(span,parent);
    }, [selectedLabel])

    const textToHumanReadable = (text: string): string => {
        return text.replaceAll("_"," ").toUpperCase()
    }

    if(appMode.mode !== 'EDIT_MODE' || !editor) return <></>
    
    const handleClose = () => {
        let newMode: "DRAWING_MODE" | "POLYGON_MODE" = editor.filter.annotationType === "polygon" ? "POLYGON_MODE" : "DRAWING_MODE"
        editor.setMode({mode: newMode})
        setLabelSearch({key: '', allowFilter: true})
        setSelectedLabel(null)
        setDirection(null)
        setPosition(null)
    }
    
    const handleDelete = async() => {
        if(appMode.shapeInEditMode instanceof Box) {
            await new RemoveBoxAction({box: appMode.shapeInEditMode, actionsStore: appMode.shapeInEditMode.image?.actionStore as ActionsStore}).directExecute();
        } else if(appMode.shapeInEditMode instanceof Polygon) {
            await new RemovePolygonAction({polygon: appMode.shapeInEditMode, actionsStore: appMode.shapeInEditMode.image?.actionStore as ActionsStore}).directExecute();
        }
        handleClose()
    }

    const createNewLabel = () => {
        const label = new Label({
            id: editor.labels.length,
            name: labelSearch.key,
            type: editor.labels.length
        })
        editor.addLabel(label)
        editor.syncLabels()
    }

    const handleSave = () => {
        if(direction !== appMode.shapeInEditMode.direction) {
            appMode.shapeInEditMode.updateDirection(direction as Direction); 
        }
        if(selectedLabel !== null && matchLables[selectedLabel]) {
            updateLabel(matchLables[selectedLabel])
        }
        handleClose();
    }
    
    return (
        <>
            <div className={styles['annotation-popup']} style={position ? {top: position.y, left: position.x} : {display: 'none'}}>
                <div className={styles["header"]}>
                    <span>Annotation Editor</span>
                    <BiX cursor={'pointer'} size={22} onClick={handleClose}/>
                </div>
                <div className={styles["content-container"]}>
                    <div className={styles["inner-container"]}>
                        <div className={styles["input-group"]}>
                            <svg className={styles["icon"]} aria-hidden="true" viewBox="0 0 24 24"><g><path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path></g></svg>
                            <input ref={inputRef} disabled={filter.annotationType === "text" || !allowLabelUpdate} placeholder="Label" value={labelSearch.key} onChange={(e) => setLabelSearch({key:e.target.value,allowFilter:true})} type="text" className={styles["input"]} autoFocus/>
                            {showDirection && <Dropdown
                                placement="bottom"
                                className={styles["direction-selector"] + " " + styles['icon-right']}
                                // className={styles['icon-right']}
                                menu={{
                                onSelect: (s) =>{setDirection(s.key)},
                                items: directions.map(d => ({
                                    key: d.value,
                                    label: d.key
                                })),
                                selectable: true,
                                selectedKeys: [direction]
                            }}
                        >
                            <span>
                            {direction || <MdOutlineDirections style={{color: 'black',fontSize: 18,marginTop: 5}}/>}
                            </span>
                        </Dropdown>}
                        </div>
                    </div>
                    <div className={styles["button-group"]}>
                        <button className={styles["delete"]} onClick={handleDelete}>Delete</button>
                        {(filter.annotationType !== 'text' && allowLabelUpdate) && <button className={styles["save"]} onClick={handleSave}>Save <IoMdReturnLeft size={18} /></button>}
                    </div>
                    <div className={styles["divider"]} />
                    {(filter.annotationType !== 'text' || allowLabelUpdate) && <div className={styles["list-options"]} ref={listRef}>
                        {
                            matchLables.length !== 0 ? (
                                <>
                                    {
                                        matchLables.map((label:Label,index:number) => (
                                            <>
                                                <span ref={(()=>selectedLabel === index ? activeRef : null)()} key={`${label}_${index}`} onClick={() => {setSelectedLabel(index);}} className={`${selectedLabel === index ? styles["active"] : ""}`}>{textToHumanReadable(label.name)}</span>
                                            </>
                                        ))
                                    }
                                </>
                            ) : (
                                <>
                                    {!allowCustomLabels ? <p>{(labelSearch.key === "" || !labelSearch.allowFilter)? "Type a label for this box." : "Try using different search key."}</p> : <>
                                        {
                                            (labelSearch.key === "" || !labelSearch.allowFilter) ? <p>Type a label for this box.</p> :
                                            <p style={{cursor:"pointer"}} onClick={createNewLabel}>Create a new label "{labelSearch.key}" </p>
                                        }
                                    </>}
                                </>
                            )
                        }
                    </div>}
                </div>
            </div>
        </>
    )
}