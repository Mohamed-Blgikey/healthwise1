import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
const StreamChat = require('stream-chat').StreamChat;
// import { StreamChat } from 'stream-chat';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  dataProfile: any;

  constructor(
    public _angularFireAuth: AngularFireAuth,
    private auth: AuthService,
    private _router: Router,
    private fs: AngularFirestore
  ) {
    // this._angularFireAuth.authState.subscribe((res) => {
    //   console.log(res);
    // });
  }

  ngOnInit(): void {
    this.auth.user.subscribe(() => {
      this.getUser();
    });
  }

  logOut() {
    // debugger;
    this._angularFireAuth
      .signOut()
      .then(() => {
        const client = StreamChat.getInstance("7hnvpxbuuvjb");
    // you can still use new StreamChat("api_key");
        client.disconnectUser();
        localStorage.removeItem('uid');
        this._router.navigate(['/home']);
      })
      .catch(() => {
        console.log('Error');
      });
  }

  private getUser() {
    this.fs
      .collection('Users')
      .ref.doc(localStorage.getItem('uid')?.toString())
      .get()
      .then((data) => {
        // console.log(data.data());
        this.dataProfile = data.data();
        // console.log(this.dataProfile);
      });
  }
}
