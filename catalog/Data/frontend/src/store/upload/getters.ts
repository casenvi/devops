import { Upload, FileUpload } from "./types";

export function countInProgress(uploads: Upload[]){
    return uploads.filter(upload => !isFinished(upload)).length;
}

export function isFinished(obj: Upload | FileUpload) {
    return obj.progress === 1 || hasError(obj);
}

export function hasError(obj: Upload | FileUpload){
    if(isUploadType(obj)){
        const upload = obj as Upload;
        return upload.files.some(file => file.error);
    }else{
        const file = obj as FileUpload;
        return file.error !== undefined;
    }
}

export function isUploadType(obj: Upload | FileUpload){
    return 'video' in obj
}
