import {connection as WebSocketConnection} from 'websocket';
import { Server } from "./server";

export class Client {
    private usernameRegex = /^[a-zA-Z0-9]*$/;
    private username: string = null;

    public constructor(private server: Server, private connection: WebSocketConnection) {
        connection.on('message', (message)=>this.onMessage(message.utf8Data));
        connection.on('close', ()=>server.removeClient(this));
        connection.on('close', ()=>server.broadcastUsersList());
        connection.on('close', ()=>server.broadcastUserConnection('disconnection',this.username));
    }

    private sendMessage(type: string, data: any): void {
        const message = {type: type, data: data};
        this.connection.send(JSON.stringify(message));
    }
   
    public sendUsersList(content: string[]) {
        const users_list = content;
        this.sendMessage('users_list', users_list);
    }
    public sendInvitation(dest : string, username: string){
        const invitation  = {dest: dest, username: username}
        this.sendMessage('invitation', invitation);

    } 

    public sendInstantMessage(content: string, author: string, date: Date) {
        const instantMessage = { content: content, author: author, date: date };
        this.sendMessage('instant_message', instantMessage);
    }

    public sendUserConnection(connection: string, username: string){
        this.sendMessage(connection, username);
    }

    private onInstantMessage(content): void {
        if (!(typeof 'content' === 'string')) return;
        if (this.username==null) return;
        this.server.broadcastInstantMessage(content, this.username);
    }

    private onUsername(username) {
        if (!(typeof 'username' === 'string')) return;
        if (!this.usernameRegex.test(username)) return;
        this.username = username;
        this.sendMessage('login', 'ok');
        this.server.broadcastUsersList();
        this.server.broadcastUserConnection('connection', username);
        
        

    }
    private onInvitation(dest){
        if (!(typeof 'dest' === 'string')) return;
        if (!this.usernameRegex.test(dest)) return;
        this.server.broadcastInvitation(dest, this.username);

}

    private onMessage(utf8Data: string): void {
        const message = JSON.parse(utf8Data);
        switch (message.type) {
            case 'instant_message': this.onInstantMessage(message.data); break;
            case 'username': this.onUsername(message.data); break;
            case 'invitation': this.onInvitation(message.data); break;
        }
    }

    public getUserName(){
        return this.username;
    }

}
