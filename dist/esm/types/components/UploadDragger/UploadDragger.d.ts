import "./UploadDragger.scss";
import { DrawingAreaEditor } from "../../models/DrawingAreaModels/DrawingAreaEditor";
import { IMImage } from "../../models/Types";
interface IProps {
    allowMultiple?: boolean;
    spacingLeft?: number;
    editor: DrawingAreaEditor;
    onUploadSubmit: (imImages: IMImage[]) => Promise<void>;
    uploadRequest: (data: FormData, onProgress: (percent: number) => void) => Promise<IMImage>;
}
export default function UploadDragger({ allowMultiple, spacingLeft, editor, uploadRequest, onUploadSubmit }: IProps): import("react/jsx-runtime").JSX.Element;
export {};
