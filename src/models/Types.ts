import { Box } from "./Box"
import { DrawingAreaEditor } from "./DrawingAreaModels/DrawingAreaEditor"
import { DrawingAreaImage } from "./DrawingAreaModels/DrawingAreaImage"
import { HumanAnnotationEditor } from "./HumanAnnotationModels/HumanAnnotationEditor"
import { HumanAnnotationImage } from "./HumanAnnotationModels/HumanAnnotationImage"
import { LegendEditor } from "./LegendAnnotationModels/LegendEditor"
import { LegendImage } from "./LegendAnnotationModels/LegendImage"
import { MetaSelectionEditor } from "./MetaSelectionModels/MetaSelectionEditor"
import { MetaSelectionImage } from "./MetaSelectionModels/MetaSelectionImage"
import { Polygon } from "./Polygon"

export type  User = {
    id_token?: string;
    session_state?: string;
    access_token: string;
    refresh_token?: string;
    token_type?: string;
    scope?: string;
    profile?: UserProfile;
    expires_at?: number;
    state?: any;

    // DEPRECATE
    id?: string
    email?: string
    firstName?: string
    lastName?: string
    timezone?: string
    authInfo?: AuthInfo | null
}

export type AuthInfo = {
    token: string
    validTill: number
}

export type UserProfile = {
    first_name?: string;
    last_name?: string;
    color?: string;
    name?: string;
    given_name?: string;
    family_name?: string;
    middle_name?: string;
    nickname?: string;
    preferred_username?: string;
    profile?: string;
    picture?: string;
    website?: string;
    email?: string;
    email_verified?: boolean;
    gender?: string;
    birthdate?: string;
    zoneinfo?: string;
    locale?: string;
    phone_number?: string;
    phone_number_verified?: boolean;
    address?: any;
    updated_at?: number;
    super_user?: boolean
}

export type AppMode = ( {
    mode: "DRAG_SELECTION_MODE" | "DRAWING_MODE" | "POLYGON_MODE",
} | {
    mode: "EDIT_MODE",
    shapeInEditMode: Box | Polygon,
    visible: boolean
    scrollIntoView: boolean
})

export type LoaderSpinner = (
    {
        visible: true,
        title: string
    } | {
        visible: false
    }
)

export type IMBox = {
    x: number,
    y: number,
    width: number, 
    height: number,
    direction: Direction,
    labelId: number,
    indexId: number,
    humanAnnotated: boolean
}

export type IMPolygon = {
    points: any[],
    direction: Direction,
    labelId: number,
    indexId: number,
    humanAnnotated: boolean
}

export type IMImage = {
    src: string,
    id: string,
    name: string
}


export type Direction =  "" | "N" | "S" | "E" | "W";

export type HumanAnnotations = {
    bbox: {
        [key: string]: [number,number,number,number]
    },
    text: {
        [key: string]: null | string
    },
    score: {
        [key: string]: number
    },
    polygon: {
        [n: number]: {
            category_name: any;
            category_id: number;
            contour: number[][];
            direction: Direction
        }
    },
    direction: {
        [key: string]: Direction
    },
    category_id: {
        [key: string]: number
    },
    category_name: {
        [key: string]: string
    }
}

export type GraphJSON = {
    area: {
        [key: string]: number
    },
    bbox: {
        [key: string]: [number,number,number,number]
    },
    text: {
        [key: string]: null | string
    },
    score: {
        [key: string]: number
    },
    newbbox: {
        [key: string]: [] | [number,number,number,number]
    },
    old_bbox: {
        [key: string]: [] | [number,number,number,number]
    },
    direction: {
        [key: string]: Direction
    },
    category_id: {
        [key: string]: number
    },
    category_name: {
        [key: string]: string
    }
}

export type LabelMappings = {
    id: number
    name: string
    type: number
}[]

export type COCOObj = {
    categories: any[];
    image: {
        id: string;
        name: string;
        src: string;
    };
    annotations: {
        index_id: number;
        bbox: any;
        score: any;
        category_id: any;
        category_name: any;
        segmentation: null;
        direction: any;
        iscrowd: number;
        area: any;
    }[];
}

export type AnnotationType = "entity" | "polygon" | "text"

export type Filter = {
    annotationType: AnnotationType
    entityType: string
    entityClass: string
}

export type ProjectSetupBBox = {
    id: number | null,
    label: string,
    x: number,
    y: number,
    width: number,
    height: number
}

export type ProjectSetupState = {
    image: IMImage,
    bounding_box: ProjectSetupBBox[]
}

export type DrawingAreaState = ProjectSetupState[]
export type MetaSelectionState = ProjectSetupState[]
export type LegendState = {image: Omit<IMImage,"src">,bounding_box: ProjectSetupBBox[]}[]

export type ImageTypes = DrawingAreaImage | HumanAnnotationImage | MetaSelectionImage | LegendImage

export type EditorTypesExceptHA = DrawingAreaEditor | MetaSelectionEditor | LegendEditor
export type EditorTypes = HumanAnnotationEditor | EditorTypesExceptHA