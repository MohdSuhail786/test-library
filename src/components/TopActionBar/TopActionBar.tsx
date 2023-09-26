import { useRecoilValue } from "recoil";
import { ArrowLeftOutlined, HomeOutlined } from '@ant-design/icons';
import styles from "./TopActionBar.module.scss";
import { activeImageAtom } from "../../state/editor";
import { BsArrowRight } from "react-icons/bs";
import { Editor } from "../../models/HumanAnnotationModels/HumanAnnotationEditor";
import { Button, Tooltip } from "antd";


interface IProps {
    editor: Editor,
    onContinue: () => void
    onSave: () => Promise<void>
}

export default function TopActionBar({editor, onContinue, onSave}: IProps) {

    const activeImage = useRecoilValue(activeImageAtom)

    return (
        <>
            <div className={styles["top-action-bar"]}>
                <div className={styles["left-container"]}>
                    <Tooltip placement='bottom' title="Home"><Button type="default" shape="circle" icon={<HomeOutlined />} onClick={() => console.log('navigate to : /workspace-screen')} /></Tooltip>
                    <Tooltip placement='bottom' title="Back"><Button type="default" shape="circle" icon={<ArrowLeftOutlined />} onClick={() => console.log(`navigate to : /jobs/{}`)} /></Tooltip>
                    <span className={styles["heading"]}>{"Human Annotation"}</span>
                </div>
                <div className={styles["pagination"]}>
                    
                </div>
                {!activeImage ? <></> :<div className={styles["button-group"]}>
                    <button className={`${styles['outline']}`} onClick={onSave}>Save </button>
                    <button className={`${styles['primary']}`} onClick={onContinue}>Continue <BsArrowRight style={{ fontWeight: 700 }} /> </button>
                </div>}
            </div>
        </>
    )
}