import { useRecoilValue } from "recoil";
import styles from "./ImageLoader.module.scss";
import { ClipLoader } from "react-spinners";
import { loaderAtom } from "../../state/editor";

interface IProps {
    spacingLeft?: number
    spacingRight?: number
    forceShow?: boolean
}

export default function ImageLoader({spacingLeft = 0,spacingRight = 0,forceShow=false}: IProps) {
    const LoaderSpinner = useRecoilValue(loaderAtom)

    if(!LoaderSpinner.visible && !forceShow) return <></>

    return (
        <>
            <div className={styles["image-loader-container"]}>
                <span className={styles["title"]} >{(LoaderSpinner as any)?.title || ""}</span>
                <div className={styles["loader"]} style={{marginLeft: spacingLeft, marginRight: spacingRight}}>
                    <ClipLoader color="rgb(66, 72, 255)" />
                </div>
            </div>
        </>
    )
}