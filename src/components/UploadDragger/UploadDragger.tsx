import "./UploadDragger.scss"
import { Progress, Upload, UploadFile, UploadProps } from "antd"
import { AiFillCheckCircle, AiFillCloseCircle, AiFillFileAdd } from "react-icons/ai"
import { imageListAtom, loaderAtom, showUploadDraggerAtom } from "../../state/editor";
import { useRef, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { BiX } from "react-icons/bi";
import { EditorTypesExceptHA, IMImage } from "../../models/Types";

const Dragger = Upload.Dragger;

interface IProps {
    allowMultiple?: boolean,
    spacingLeft?: number,
    editor: EditorTypesExceptHA
    onUploadSubmit: (imImages: IMImage[]) => Promise<void>
    uploadRequest: (data: FormData, onProgress: (percent: number) => void) => Promise<IMImage>
}

export default function UploadDragger({allowMultiple = false, spacingLeft = 0, editor, uploadRequest, onUploadSubmit}: IProps) {
    const [fileList, setFileList] = useState<UploadFile[]>([])
    const setLoader = useSetRecoilState(loaderAtom)
    const imImageListRef = useRef<IMImage[]>([])
    const imageList = useRecoilValue(imageListAtom)
    const setShowUploadDragger = useSetRecoilState(showUploadDraggerAtom)

    const props: UploadProps = ({
        name: 'file',
        multiple: allowMultiple,
        maxCount: allowMultiple ? Infinity : 1,
        customRequest: async (options) => {
            const { onSuccess, onError, file, onProgress } = options;

            const fmData = new FormData();
            
            fmData.append("file", file);

            try {
                const imImage:IMImage = await uploadRequest(fmData,(percent) => onProgress && onProgress({ percent }));
                imImageListRef.current = [...imImageListRef.current, imImage];
                onSuccess && onSuccess("Ok");
            } catch (err) {
                console.log("Eroor: ", err);
                onError && (onError as any)({ err });
            }
        },
        itemRender: (originNode, file, currFileList, actions) => {
            setFileList(currFileList);
            const percent = file.percent
            const status = file.status as string;
            return (
                <div className={`item ${status === "done" && "success"} ${status === "error" && "error"} ${status === "uploading" && "progress"}`}>
                    <div className="content">
                        <div className="meta">
                            <span>{file.name}</span>
                            {["uploading"].includes(status) && <span>{percent}%</span>}
                            {status === "error" && <AiFillCloseCircle cursor={"pointer"} onClick={() => actions.remove()} size={20}/>}
                            {status === "done" && <AiFillCheckCircle size={20}/>}
                        </div>
                        {["uploading"].includes(status) && <Progress percent={percent} strokeColor={'rgb(66, 72, 255)'} trailColor="white" showInfo={false}/>}
                    </div>
                </div>
            )
        }
    });

    const handleSubmit = async (e:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation()
        if(isUploading || !isSuccess) return;
        try {
            setShowUploadDragger(false)
            setLoader({title: "Loading Editor", visible: true})
            await onUploadSubmit(imImageListRef.current)
        } catch (error) {
            console.log(error)
        } finally {
            setLoader({visible: false})
        }
    }

    const handleClose = (e:React.MouseEvent<SVGAElement, MouseEvent>) => {
        e.stopPropagation();
        setShowUploadDragger(false);
    }

    const isUploading = fileList.find(file => file.status === 'uploading');
    const isSuccess = fileList.find(file => file.status === "done")

    return (
        <>
            <div className="upload-dragger">
                <div className="container">
                    <Dragger {...props}>
                        <div className={`inner-container ${fileList.length && "mini"}`}>
                            { imageList.length ? <BiX cursor={'pointer'} className="close" size={25} onClick={handleClose}/> : ""}
                            <AiFillFileAdd color="rgb(66, 72, 255)" size={50}/>
                            {allowMultiple ? <span>Select Files to Upload</span> : <span>Select a File to Upload</span>}
                            {allowMultiple ? <p>or Drag and Drop, Copy and Paste Files here</p> : <p>or Drag and Drop, Copy and Pase a File here</p>}
                        </div>
                        {fileList.length ? <div className={`submit`}> <button className={`save  ${(isUploading || !isSuccess) ? 'disable' : ""}`} onClick={handleSubmit} >Submit </button> </div> : <></>}
                    </Dragger>
                </div>
            </div>
        </>
    )
}