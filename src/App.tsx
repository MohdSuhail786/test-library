import { LabelList, graphJSON, humanAnnotations, imageSrc, labelMappings } from "./constants/Constants"
import { ReactNode, useEffect } from "react";
import useDrawingAreaAnnotator from "./exportableComponents/useDrawingAreaAnnotator";
import { DrawingAreaState, GraphJSON, HumanAnnotations, MetaSelectionState } from "./models/Types";
import { useHumanAnnotator } from "./exportableComponents";


// export default function App() {

//     const [HumanAnnotator, init, handleSave] = useHumanAnnotator()

//     useEffect(()=>{
//         setTimeout(()=>{
//             init({
//                 editorSpacingLeft:0,
//                 editorSpacingTop:0,
//                 graphJSON: graphJSON as unknown as GraphJSON,
//                 labelMappings: labelMappings,
//                 humanAnnotations: humanAnnotations as HumanAnnotations,
//                 imageSrc: imageSrc
//             })
//         },0);
//     },[])

//     return (
//         <> 
//             {HumanAnnotator as ReactNode}
//         </>
//     )
// }

export default function App() {

    // const [DrawingAreaAnnotator, init, handleSave] = useDrawingAreaAnnotator()

    // useEffect(()=>{
    //     setTimeout(()=>{
    //         init({
    //             drawingAreaState: [{image: {id: '1', name: 'Any Name', src: imageSrc}, bounding_box: [
    //             //     {
    //             //     "id": 131,
    //             //     "label": "graphic-area",
    //             //     "x": 0,
    //             //     "y": 0,
    //             //     "width": 5600,
    //             //     "height": 4550
    //             // }
    //         ]}] as DrawingAreaState,
    //             editorSpacingLeft:0,
    //             editorSpacingTop:0,
    //             labelMappings: LabelList.DrawingArea.map((label,index) => ({id: index, name: label, type: index})),
    //         })
    //     },0);
    // },[])

    return (
        <> 
            <DrawingAreaModal />
        </>
    )
}

import { Modal } from "antd";
import { FiX } from "react-icons/fi";
import useMetaExtractionAnnotator from "./exportableComponents/useMetaExtractionAnnotator";

interface IProps {
}

export function DrawingAreaModal(props: IProps) {

    const [DrawingAreaAnnotator, init, handleSave, setLoader] = useMetaExtractionAnnotator()

    const handleCancel = (e: any) => {
        e.stopPropagation();
    }

    useEffect(()=>{
        init({
            metaExtractionState: [
        //         {image: {id: '1', name: 'Any Name', src: imageSrc}, bounding_box: [
        //     //     {
        //     //     "id": 131,
        //     //     "label": "graphic-area",
        //     //     "x": 0,
        //     //     "y": 0,
        //     //     "width": 5600,
        //     //     "height": 4550
        //     // }
        // ]}
    ] as MetaSelectionState,
            editorSpacingLeft:492,
            editorSpacingTop:100,
            labelMappings: LabelList.DrawingArea.map((label,index) => ({id: index, name: label, type: index})),
            uploadRequest: (data: FormData, onProgress: (percent: number) => void) => new Promise(resolve => resolve({id: '1',src: imageSrc, name: ''})),
            onUploadSubmit: () => new Promise(r => setTimeout(r,2000))
        })

        setTimeout(() => {
            init({
                metaExtractionState: [
                    {image: {id: '1', name: 'Any Name', src: imageSrc}, bounding_box: [
                    {
                    "id": 131,
                    "label": "graphic-area",
                    "x": 0,
                    "y": 0,
                    "width": 5600,
                    "height": 4550
                }
            ]}
        ] as MetaSelectionState,
                editorSpacingLeft:492,
                editorSpacingTop:100,
                labelMappings: LabelList.DrawingArea.map((label,index) => ({id: index, name: label, type: index})),
                uploadRequest: (data: FormData, onProgress: (percent: number) => void) => new Promise(resolve => resolve({id: '1',src: imageSrc, name: ''})),
                onUploadSubmit: () => new Promise(r => r())
            })
            setTimeout(() => {
                console.log(handleSave())
            }, 1000);
        }, 3000);
    },[])

    return (
        // <Modal key={'drawing-area-modal'}
        //     centered={true}
        //     footer={null}
        //     keyboard={false}
        //     className="attribute-modal project-setup-modal"
        //     closeIcon={<></>}
        //     open={true} getContainer={false}
        //     forceRender focusTriggerAfterClose={false}
        //     onCancel={handleCancel}
        //     width={'90%'}
        // >
            <div className='attribute-modal-body'>
                <div className='header'>
                    <span className='title'>{"Drawing B Box"}</span>
                    <FiX size={20} onClick={handleCancel} />
                </div>
                {DrawingAreaAnnotator}
            </div>
        // </Modal>
    )
}
