import { File as MFile } from '@/models/file';
import { MyFile as MMyFile, myFilesToJson as MMyFilesToJson } from '@/models/myFile';

interface ApiConstructorParams {
    ip: string;
    port: number;
    onMessage?: (data: any) => void;
    onClose?: () => void;
    onError?: (error: Event) => void;
}

export class Api {
    #ip: string;
    #port: number;
    #socket?: WebSocket;
    #onMessage?: (data: any) => void;
    #onClose?: () => void;
    #onError?: (error: any) => void;

    constructor(params: ApiConstructorParams) {
        this.#ip = params.ip;
        this.#port = params.port;
        this.#onMessage = params.onMessage;
        this.#onClose = params.onClose;
        this.#onError = params.onError;
    }

    start() {
        this.#socket = new WebSocket(`ws://${this.#ip}:${this.#port}`);
        this.#socket.onopen = () => {
            console.log('Connected');
        };
        this.#socket.onmessage = (message: MessageEvent<string>) => {
            const data = JSON.parse(message.data);
            this.#onMessage?.(data);
        };
        this.#socket.onclose = () => {
            this.#onClose?.();
        };
        this.#socket.onerror = (error: Event) => {
            this.#onError?.(error);
        };
    }

    stop() {
        this.#socket?.close();
    }

    sendMyFilesInfoToServer(myFiles: MMyFile[]) {
        this.#send(JSON.stringify({
            type: 'files',
            files: MMyFilesToJson(myFiles)
        }));
    }

    requestDownloadFile(file: MFile) {
        this.#send(JSON.stringify({
            type: 'downloadFile',
            fileId: file.id
        }));
    }

    uploadFile(url: string, file: MMyFile) {
        fetch(url, {
            method: 'POST',
            headers: {
                filename: file.name
            },
            body: file.file
        });
    }

    #send(data: string) {
        this.#socket?.send(data);
    }
}
