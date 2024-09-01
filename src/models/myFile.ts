import { v4 as uuidv4 } from 'uuid';
import { File as MFile } from './file';

interface Params {
    name: string;
    size: number;
    file: File;
}

export class MyFile extends MFile {
    public readonly file: File;

    constructor({ name, size, file } : Params) {
        super({ id: uuidv4(), name, size});

        this.file = file;
    }

    toJson(): Object {
        return {
            id: this.id,
            name: this.name,
            size: this.size
        };
    }
}

export const myFilesToJson = (myFiles: MyFile[]): Object[] => {
    return myFiles.map((myFile) => myFile.toJson());
};
