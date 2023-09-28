import { Pagination, Tooltip } from "antd";
import { LegendEditor } from "../../models/LegendAnnotationModels/LegendEditor";
import "./Pagination.scss"
import { FiPlus } from "react-icons/fi";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { activeImageAtom, imageListAtom, showUploadDraggerAtom } from "../../state/editor";
import { LegendImage } from "../../models/LegendAnnotationModels/LegendImage";

interface IProps {
    editor: LegendEditor
    spacingRight?: number
}

export default function ImageListPagination({editor,spacingRight}: IProps) {
    const imageList = useRecoilValue(imageListAtom)
    const activeImage = useRecoilValue(activeImageAtom)
    const setShowUploadDragger = useSetRecoilState(showUploadDraggerAtom)

    const handleChange = async (page: number) => {
        const image = imageList.find((_,index) => page === index +1)
        if(image) {
            await editor.loadImage(image as LegendImage)
        }
    }

    const handleAddImage = () => {
        setShowUploadDragger(true)
    }

    return(
        <>
            <div className="pagination-container" style={{left: `calc(50% + -${spacingRight ?? 0}px)`}}>
                <Pagination 
                    total={imageList.length}
                    simple
                    current={imageList.findIndex(image => image.id() === activeImage?.id()) + 1}
                    pageSize={1}
                    onChange={handleChange}
                />
                <Tooltip title="Upload Images"><span className="add-image" onClick={handleAddImage}><FiPlus /></span></Tooltip>
            </div>
        </>
    )
}