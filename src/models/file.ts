interface Params {
    id: string;
    name: string;
    size: number;
}

export class File {
    public readonly id: string;
    public readonly name: string;
    public readonly size: number;

    constructor({ id, name, size } : Params) {
        this.id = id;
        this.name = name;
        this.size = size;
    }

    get readableSize(): string {
        if (this.size < 1024) {
            return `${this.size} B`;
        } else if (this.size < 1024 * 1024) {
            return `${(this.size / 1024).toFixed(1)} KB`;
        } else if (this.size < 1024 * 1024 * 1024){
            return `${(this.size / (1024 * 1024)).toFixed(1)} MB`;
        } else {
            return `${(this.size / (1024 * 1024 * 1024)).toFixed(1)} GB`;
        }
    }
}
