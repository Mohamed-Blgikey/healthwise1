import { Injectable } from '@angular/core';
const StreamChat = require('stream-chat').StreamChat;
@Injectable({
  providedIn: 'root'
})
export class ChatStreamService {

  constructor() { }
  async stupChannel(userId:string,name:string,imageProfile:string){
    const client = StreamChat.getInstance("cg3hymfkv4s8");
    // you can still use new StreamChat("api_key");
    await client.connectUser(
        {
            id: userId,
            name: name,
            image: imageProfile,
        },
        await client.devToken(userId),
    );
  }
}
