import { LabelList, graphJSON, humanAnnotations, imageSrc, labelMappings } from "./constants/Constants"
import { ReactNode, useEffect } from "react";
import useDrawingAreaAnnotator from "./exportableComponents/useDrawingAreaAnnotator";
import { DrawingAreaState, GraphJSON, HumanAnnotations, LegendState, MetaSelectionState } from "./models/Types";
import { useHumanAnnotator, useLegendAnnotator, useMetaAreaAnnotator } from "./exportableComponents";


function HumanAnnotatorCOmp() {

    const [HumanAnnotator, init, handleSave] = useHumanAnnotator()

    useEffect(()=>{
        setTimeout(()=>{
            init({
                editorSpacingLeft:0,
                editorSpacingTop:0,
                graphJSON: graphJSON as unknown as GraphJSON,
                labelMappings: labelMappings,
                humanAnnotations: humanAnnotations as HumanAnnotations,
                imageSrc: imageSrc
            })
        },0);
    },[])

    return (
        <> 
            {HumanAnnotator as ReactNode}
        </>
    )
}

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
            <HumanAnnotatorCOmp />
        </>
    )
}

// import { Modal } from "antd";
// import { FiX } from "react-icons/fi";
// import useMetaExtractionAnnotator from "./exportableComponents/useMetaExtractionAnnotator";
// import { uuidv4 } from "./utils/utils";

// interface IProps {
// }

// export function DrawingAreaModal(props: IProps) {

//     const [DrawingAreaAnnotator, init, addNewImage, handleSave, setLoader] = useLegendAnnotator()

//     const handleCancel = (e: any) => {
//         e.stopPropagation();
//     }

//     useEffect(()=>{
//         init({
//             legendState: [
//                 {image: {id: '1', name: 'Any Name'}, bounding_box: [
//                 {
//                 "id": 131,
//                 "label": "graphic-area",
//                 "x": 0,
//                 "y": 0,
//                 "width": 5600,
//                 "height": 4550,
//             }
//         ]},
//         {image: {id: '2', name: 'Any Name', src: imageSrc}, bounding_box: [
//     ]}
//     ] as LegendState,
//             editorSpacingLeft:492,
//             editorSpacingTop:100,
//             labelMappings: labelMappings,
//             uploadRequest: (data: FormData, onProgress: (percent: number) => void) => new Promise(resolve => resolve({id: uuidv4(),src: imageSrc, name: ''})),
//             onUploadSubmit: () => new Promise(r => setTimeout(r,2000)),
//             onImageRequest: async (id:number):Promise<string> => {
//                 await new Promise(resolve => setTimeout(resolve,2000))
//                 return imageSrc;
//             }  
//         })

//         // setTimeout(() => {
//         //     console.log("SLDKjf ")
//         //     addNewImage({
//         //         id: '131',
//         //         name: '',
//         //         src: ''
//         //     })
//         //     setTimeout(() => {
//         //         addNewImage({
//         //             id: '132',
//         //             name: '',
//         //             src: ''
//         //         })
//         //     }, 3000);
//         // }, 3000);

//         // setTimeout(() => {
//         //     init({
//         //         legendState: [
//         //             {image: {id: '1', name: 'Any Name'}, bounding_box: [
//         //             {
//         //             "id": 131,
//         //             "label": "graphic-area",
//         //             "x": 0,
//         //             "y": 0,
//         //             "width": 5600,
//         //             "height": 4550
//         //         }
//         //     ]}
//         // ] as MetaSelectionState,
//         //         editorSpacingLeft:492,
//         //         editorSpacingTop:100,
//         //         labelMappings: labelMappings,
//         //         uploadRequest: (data: FormData, onProgress: (percent: number) => void) => new Promise(resolve => resolve({id: '1',src: imageSrc, name: ''})),
//         //         onUploadSubmit: () => new Promise(r => r())
//         //     })
//         //     setTimeout(() => {
//         //         console.log(handleSave())
//         //     }, 1000);
//         // }, 3000);
//     },[])

//     return (
//         // <Modal key={'drawing-area-modal'}
//         //     centered={true}
//         //     footer={null}
//         //     keyboard={false}
//         //     className="attribute-modal project-setup-modal"
//         //     closeIcon={<></>}
//         //     open={true} getContainer={false}
//         //     forceRender focusTriggerAfterClose={false}
//         //     onCancel={handleCancel}
//         //     width={'90%'}
//         // >
//             <div className='attribute-modal-body'>
//                 <div className='header'>
//                     <span className='title'>{"Drawing B Box"}</span>
//                     <FiX size={20} onClick={() => console.log(handleSave())} />
//                 </div>
//                 {DrawingAreaAnnotator}
//             </div>
//         // </Modal>
//     )
// }
