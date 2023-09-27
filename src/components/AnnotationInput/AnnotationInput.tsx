import { Dropdown, Select } from "antd";
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

interface IProps {
    editor: EditorTypes
    shape: Box | Polygon
    index: number
    showDirection?: boolean
    allowLabelUpdate?: boolean
}

export default function AnnotationInput({shape, index, editor,allowLabelUpdate=true, showDirection = true}: IProps) {
    const labels = useRecoilValue(labelListAtom)
    const appMode = useRecoilValue(appModeAtom)
    
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

    const active = appMode.mode === "EDIT_MODE" && appMode.shapeInEditMode._id === shape._id

    return (
        <>
            <div className={`${styles['label-input-item']} ${active ? styles['active']:''}`} onMouseOver={() => shape.showAnchors()} onMouseOut={() => !active && shape.hideAnchors()}>
                <div className={styles["color"]} style={{backgroundColor: shape.label?.stroke}} onClick={handleClick}/>
                {
                    allowLabelUpdate ? <Select
                        showSearch
                        className={styles["label-selector"]}
                        placeholder="Search"
                        value={shape.label?.name}
                        bordered={false}
                        suffixIcon={null}
                        disabled={!allowLabelUpdate}
                        optionFilterProp="children"
                        onChange={handleLabelChange}
                        // onSearch={onSearch}
                        // filterOption={filterOption}
                        style={{flex: 1}}
                        options={labels.map(label => ({
                            label: label.name,
                            value: label.id,
                            instance: label
                        }))}
                    /> : 
                    <>
                        <span style={{flex: 1, cursor: 'default', userSelect: 'none'}}>{shape.label?.name || ""}</span>
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
                <RiDeleteBin6Line style={{fontSize: 17,cursor: "pointer",color: '#d32424f0'}} onClick={handleDelete}/>
            </div>
        </>
    )
}