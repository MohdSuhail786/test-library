import styles from "./Toolbar.module.scss";
import { MdOutlineFitScreen } from 'react-icons/md';
import { BsBoundingBox, BsBrightnessHigh } from 'react-icons/bs';
import { LiaHandPaperSolid, LiaRedoAltSolid, LiaUndoAltSolid } from 'react-icons/lia';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import { PiPolygonBold } from 'react-icons/pi';
import { useRecoilValue } from "recoil";
import { appModeAtom, filterAtom } from "../../state/editor";
import { Editor } from "../../models/HumanAnnotationModels/HumanAnnotationEditor";
import { AppMode } from "../../models/Types";

interface IProps {
    editor: Editor
    style?: any
}

export default function Toolbar({editor, style={}}: IProps) {

    const appMode = useRecoilValue(appModeAtom);
    const filter = useRecoilValue(filterAtom)

    const setMode = (mode: AppMode) => () => {
        if(!editor || appMode.mode === "EDIT_MODE") return;
        editor.setMode(mode)
    }

    const zoomInOut = (deltaY: number) => () => {
        if(!editor) return;
        const centerPos = { x: (editor.width() - 300) / 2 + 300, y: (editor.height() - 55) / 2 + 55 }
        editor.zoomInOutStage({ deltaY, preventDefault: () => {}, ctrlKey: true } as WheelEvent, centerPos, centerPos)
    }

    if(!editor) return <></>;

    return (
        <>
            <div className={styles["toolbar"]} style={style}>
                <div className={`${styles['item']} ${appMode.mode === 'DRAG_SELECTION_MODE' && styles["active"]}`} onClick={setMode({mode: "DRAG_SELECTION_MODE"})}><LiaHandPaperSolid /></div>
                {["entity","text"].includes(filter.annotationType) && <div className={`${styles['item']} ${appMode.mode === 'DRAWING_MODE' && styles["active"]}`} onClick={setMode({mode: "DRAWING_MODE"})}><BsBoundingBox /></div>}
                {filter.annotationType === "polygon" && <div className={`${styles['item']} ${appMode.mode === 'POLYGON_MODE' && styles["active"]}`} onClick={setMode({mode: "POLYGON_MODE"})}><PiPolygonBold /></div>}
                <div className={styles["divider"]} />
                <div className={styles["item"]} onClick={zoomInOut(0)}><AiOutlinePlus /></div>
                <div className={styles["item"]} onClick={() => editor.fitToScreen()}><MdOutlineFitScreen /></div>
                <div className={styles["item"]} onClick={zoomInOut(1)}><AiOutlineMinus /></div>
                <div className={styles["divider"]} />
                <div className={styles["item"]} onClick={() => editor.activeImage?.actionStore.undo().catch((e) => console.log(e))}><LiaUndoAltSolid /></div>
                <div className={styles["item"]} onClick={() => editor.activeImage?.actionStore.redo().catch((e) => console.log(e))}><LiaRedoAltSolid /></div>
                <div className={styles["divider"]} />
                <div className={styles["item"]}><BsBrightnessHigh /></div>
            </div>
        </>
    )
}