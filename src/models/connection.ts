import { File as MFile } from './file';

interface Params {
    ip: string;
    files: MFile[];
}

export class Connection {
    public readonly ip: string;
    public readonly files: MFile[];

    constructor({ ip, files}: Params) {
        this.ip = ip;
        this.files = files;
    }
}
