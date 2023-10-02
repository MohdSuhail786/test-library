import { Button, Divider, Dropdown, Input, Select, Space } from "antd";
import { Box } from "../../models/Box";
import { Polygon } from "../../models/Polygon";
import styles from "./AnnotationInput.module.scss";
import { useRecoilValue } from "recoil";
import { appModeAtom, labelListAtom } from "../../state/editor";
import { RiDeleteBin6Line } from 'react-icons/ri'
import { MdOutlineDirections } from "react-icons/md";
import { Direction, EditorTypes } from "../../models/Types";
import { RemoveBoxAction } from "../../actions/RemoveBoxAction";
import ActionsStore from "../../actions/ActionStore";
import { RemovePolygonAction } from "../../actions/RemovePolygonAction";
import { Label } from "../../models/Label";
import { directions } from "../../constants/Constants";
import { AiOutlineRotateRight } from "react-icons/ai";
import { FiPlus } from "react-icons/fi";
import { useRef, useState } from "react";
import { VscSync, VscSyncIgnored } from "react-icons/vsc";

interface IProps {
    editor: EditorTypes
    shape: Box | Polygon
    index: number
    showDirection?: boolean
    allowLabelUpdate?: boolean
    showRotation?: boolean
    allowCustomLabels?: boolean
}

export default function AnnotationInput({shape, index, editor,allowLabelUpdate=true, showDirection = true,showRotation=false, allowCustomLabels= false}: IProps) {
    const labels = useRecoilValue(labelListAtom)
    const appMode = useRecoilValue(appModeAtom)
    const [customLabel,setCustomLabel] = useState("")
    
    const handleDelete = async () => {
        if(shape instanceof Box) {
            await new RemoveBoxAction({box: shape, actionsStore: shape.image?.actionStore as ActionsStore}).directExecute();
        } else if(shape instanceof Polygon) {
            await new RemovePolygonAction({polygon: shape, actionsStore: shape.image?.actionStore as ActionsStore}).directExecute();
        }
        let newMode: "DRAWING_MODE" | "POLYGON_MODE" = editor.filter.annotationType === "polygon" ? "POLYGON_MODE" : "DRAWING_MODE"
        editor.setMode({mode: newMode})
    }

    const handleLabelChange = (_:any,{instance}: any) => {
        shape.updateLabel(instance as Label)
    }

    const handleClick = () => {
        editor.fitToScreen();
        editor.setMode({mode: 'EDIT_MODE',shapeInEditMode: shape,visible: true, scrollIntoView: false})
    }

    const createNewLabel = () => {
        if(customLabel.trim() === '') return;

        const label = new Label({
            id: editor.labels.length,
            name: customLabel,
            type: editor.labels.length
        })
        editor.labels.unshift(label)
        editor.syncLabels()
        setCustomLabel("")
    }

    const active = appMode.mode === "EDIT_MODE" && appMode.shapeInEditMode._id === shape._id

    return (
        <>
            <div className={`${styles['label-input-item']} ${active ? styles['active']:''}`} onMouseOver={() => shape.showAnchors()} onMouseOut={() => !active && shape.hideAnchors()}>
                <div className={styles["color"]} style={{backgroundColor: shape.label?.stroke || 'rgb(0, 0, 0,0.1)'}} onClick={handleClick}/>
                {
                    allowLabelUpdate ? <Select
                        showSearch
                        className={styles["label-selector"]}
                        placeholder="Search"
                        value={shape.label?.name}
                        bordered={false}
                        suffixIcon={null}
                        disabled={!allowLabelUpdate}
                        optionFilterProp="label"
                        onChange={handleLabelChange}
                        dropdownRender={(menu) => (
                            <>
                            {menu}
                            {allowCustomLabels && <><Divider style={{ margin: '8px 0' }} />
                            <div style={{ display: 'flex',alignItems: 'center',gap: 5, padding: '0 8px 4px' }}>
                                <Input
                                placeholder="Please enter item"
                                value={customLabel}
                                onChange={(e) => setCustomLabel(e.target.value)}
                                />
                                <Button type="text" icon={<FiPlus />} 
                                onClick={createNewLabel}
                                >
                                </Button>
                            </div></>}
                            </>
                        )}
                        // onSearch={onSearch}
                        // filterOption={(option)=>option}
                        style={{flex: 1}}
                        options={labels.map(label => ({
                            label: label.name,
                            value: label.name,
                            instance: label
                        }))}
                    /> : 
                    <>
                        <span style={{flex: 1, cursor: 'default', userSelect: 'none', textAlign: 'start'}}>{shape.label?.name || ""}</span>
                    </>
                }
                  {showDirection && <Dropdown
                        placement="bottom"
                        className={styles["direction-selector"]}
                        menu={{
                        onSelect: (s) =>{shape.updateDirection(s.key as Direction)},
                        items: directions.map(d => ({
                            key: d.value,
                            label: d.key
                        })),
                        selectable: true,
                        selectedKeys: [shape.direction]
                    }}
                >
                    <span>
                    {shape.direction || <MdOutlineDirections style={{color: 'black',fontSize: 18}}/>}
                    </span>
                </Dropdown>}
                {showRotation && <Dropdown
                        placement="bottom"
                        className={styles["direction-selector"] + " " + styles['icon-right']}
                        // className={styles['icon-right']}
                        menu={{
                        onSelect: (s) =>{(shape as Box).updateRotated(s.key === 'true')},
                        items:[{key:"True",value:'true'},{key:"False",value:'false'}].map(d => ({
                            key: d.value,
                            label: d.key
                        })),
                        selectable: true,
                        selectedKeys: [`${(shape as Box).rotated}`]
                    }}
                >
                    <span>
                    {`${(shape as Box).rotated}` === 'true' ? <VscSync style={{color: 'black',fontSize: 18,marginTop: 5}}/> : <VscSyncIgnored style={{color: 'black',fontSize: 18,marginTop: 5}}/>}
                    </span>
                </Dropdown>}
                <RiDeleteBin6Line style={{fontSize: 17,cursor: "pointer",color: '#d32424f0'}} onClick={handleDelete}/>
            </div>
        </>
    )
}