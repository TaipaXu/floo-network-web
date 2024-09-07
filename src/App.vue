<template>
    <v-app>
        <v-layout>
            <v-app-bar
            color="primary"
            prominent>
                <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

                <v-toolbar-title>Floo Network</v-toolbar-title>

                <v-spacer></v-spacer>

                <v-btn icon="mdi-plus" variant="text" @click="addMyFiles"></v-btn>
            </v-app-bar>

            <v-navigation-drawer
            v-model="drawer">
                <v-list
                density="compact"
                nav
                activatable
                :activated="[tab]">
                    <v-list-item
                    prepend-icon="mdi-folder"
                    title="My Files"
                    value="myFiles"
                    @click="tab = 'myFiles'; drawer = false"></v-list-item>
                    <v-list-item
                    v-for="item in connections"
                    :key="item.ip"
                    prepend-icon="mdi-folder"
                    :title="item.ip"
                    :value="item.ip"
                    @click="tab = item.ip; drawer = false;"></v-list-item>
                </v-list>
            </v-navigation-drawer>

            <v-main style="overflow-y: overlay;">
                <v-tabs-window v-model="tab">
                    <v-tabs-window-item value="myFiles">
                        <v-container>
                            <v-card
                            v-for="item in myFiles"
                            :key="item.id"
                            elevation="2"
                            style="margin-bottom: 10px;">
                                <v-card-item>
                                    <v-card-title>{{ item.name }}</v-card-title>
                                    <v-card-subtitle>{{ item.readableSize }}</v-card-subtitle>
                                </v-card-item>

                                <v-card-actions>
                                    <v-btn @click="removeMyFile(item)">Remove</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-container>
                    </v-tabs-window-item>

                    <v-tabs-window-item
                    v-for="item in connections"
                    :key="item.ip"
                    :value="item.ip">
                        <v-container>
                            <v-card
                            v-for="file in item.files"
                            :key="file.id"
                            elevation="2"
                            style="margin-bottom: 10px;">
                                <v-card-item>
                                    <v-card-title>{{ file.name }}</v-card-title>
                                    <v-card-subtitle>{{ file.readableSize }}</v-card-subtitle>
                                </v-card-item>

                                <v-card-actions>
                                    <v-btn @click="download(file)">Download</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-container>
                    </v-tabs-window-item>
                </v-tabs-window>
            </v-main>
        </v-layout>
    </v-app>
</template>

<script setup lang="ts">
import { Api as MApi } from '@/apis/base';
import { File as MFile } from '@/models/file';
import { MyFile as MMyFile } from '@/models/myFile';
import { Connection as MConnection } from '@/models/connection';

const drawer = ref(false);
const tab = ref('myFiles');

const ip: string = globalThis.location.hostname;
let wsPort: number | undefined;
const myFiles: Ref<MMyFile[]> = ref([]);
const connections: Ref<MConnection[]> = ref([]);

const url = new URL(globalThis.location.href);
if (url.searchParams.has('wsPort') && !isNaN(Number(url.searchParams.get('wsPort')))) {
    wsPort = Number(url.searchParams.get('wsPort'));
}

const addMyFiles = async () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.multiple = true;
    fileInput.style.display = 'none';
    fileInput.addEventListener('change', (event: Event) => {
        const files = (event.target as HTMLInputElement).files;
        if (files) {
            for (const file of files) {
                myFiles.value.push(new MMyFile({
                    name: file.name,
                    size: file.size,
                    file: file
                }));
            }
        }
        sendMyFilesInfoToServer();

        document.body.removeChild(fileInput);
    });
    document.body.appendChild(fileInput);
    fileInput.click();
};

const removeMyFile = (file: MMyFile) => {
    myFiles.value = myFiles.value.filter((item) => item !== file);

    sendMyFilesInfoToServer();
};

const sendMyFilesInfoToServer = () => {
    api.sendMyFilesInfoToServer(myFiles.value);
};

const download = (file: MFile) => {
    api.requestDownloadFile(file);
};

const api: MApi = new MApi({
    ip,
    port: wsPort!,
    onMessage(data: any) {
        const type: 'files' = data.type;
        if (type === 'files') {
            const connectionsTmp: MConnection[] = [];
            const myIp: string = data.you;
            for (const [key, value] of Object.entries(data.files)) {
                if (key !== myIp) {
                    const files: MFile[] = [];
                    for (const item of value as any) {
                        files.push(new MFile({
                            id: item.id,
                            name: item.name,
                            size: item.size
                        }));
                    }
                    connectionsTmp.push(new MConnection({
                        ip: key,
                        files
                    }));
                }
            }
            connections.value = connectionsTmp;
        } else if (type === 'uploadFileReady') {
            let serverIp: string = data.ip;
            if (serverIp === 'server') {
                serverIp = ip;
            }
            const downloadId: string = data.downloadId;
            const port: number = data.port;
            globalThis.open(`http://${serverIp}:${port}/${downloadId}`);
        } else if (type === 'prepareUpload') {
            let ServerIp: string = data.ip;
            if (ServerIp === 'server') {
                ServerIp = ip;
            }
            const downloadId: string = data.downloadId;
            const port: number = data.port;
            const myFile = myFiles.value.find((item) => item.id === data.fileId);

            if (myFile !== undefined) {
                api.uploadFile(`http://${ServerIp}:${port}/${downloadId}`, myFile);
            }
        }
    }
});

api.start();
</script>

<style lang="scss">
#app {
    width: 100vw;
    height: 100vh;
}
</style>
