export function uuidv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function convertFileToBlob(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  })
}

export function humanToCOCOObj(graphObj:any) {
  let Annotations:any = []
  if (graphObj === null || graphObj === "null") return Annotations
  const len = Object.keys(graphObj["bbox"]).length
  for (let index = 0; index < len; index++) {
      let Annotation = {
          index_id: index,
          category_id: graphObj["category_id"][index],
          category_name: graphObj["category_name"][index],
          iscrowd: 2,
          segmentation: null,
          area: 0,
          bbox: graphObj["bbox"][index],
          score: 1,
          direction: graphObj["direction"][index],
      }
      
      Annotations.push(Annotation)
  }

  if(Object.values(graphObj?.polygon || {})?.length) {
      Object.values(graphObj.polygon).forEach((polygon:any, index) => {
          let Annotation = {
              index_id: index + len,
              category_id: polygon.category_id,
              category_name: polygon.category_name,
              iscrowd: 2,
              segmentation: polygon.contour?.flat(),
              image_id: 0,
              area: 0,
              bbox: null,
              score: 1,
              direction: polygon?.direction || "",
          }
          Annotations.push(Annotation)
      })
  }

  return Annotations
}

export function graphToCOCOObj(graphObj: any, labelMappings: any[], imageSrc: string) {
  let Annotations = []

  const len = Object.keys(graphObj["bbox"]).length
  for (let index = 0; index < len; index++) {
      let Annotation = {
          index_id: index,
          bbox: graphObj["bbox"][index],
          score: graphObj["score"][index],
          category_id: graphObj["category_id"][index],
          category_name: graphObj["category_name"][index],
          segmentation: null,
          direction: graphObj["direction"][index],
          iscrowd: 0,
          area: graphObj["area"][index]
      }
      
      Annotations.push(Annotation)
  }

  const obj = {
      categories: labelMappings,
      image: {
        id: '1',
        name: "sampleImageName",
        src: imageSrc
      },
      annotations: Annotations,
  }
  
  return obj
}

export function getLabelColors() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return [color, color+'30'];
}

export function groupArrayInPairs(arr:any[]) {
  const result = [];
  for (let i = 0; i < arr.length; i += 2) {
      result.push([arr[i], arr[i + 1]]);
  }
  return result;
}