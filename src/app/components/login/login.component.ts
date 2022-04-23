import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { AuthService } from 'src/app/services/auth.service';
import { ChatStreamService } from 'src/app/services/chat-stream.service';

// import { StreamChat } from 'stream-chat'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  dataProfile: any;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });
  constructor(
    private authservice: AuthService,
    private _router: Router,
    private toast: HotToastService,
    private fs: AngularFirestore,
    private _chatStream:ChatStreamService
  ) {}
  

  ngOnInit(): void {}

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  submit() {
    if (!this.loginForm.valid) {
      return;
    }

    const { email, password } = this.loginForm.value;
    this.authservice
      .loginByEmail(email, password)
      .pipe(
        this.toast.observe({
          success: 'Logged in successfully',
          loading: 'Logging in...',
          error: ({ message }) => `There was an error: ${message} `,
        })
      )
      .subscribe((user) => {
        this.authservice.user.next(user.user);
        // console.log(user.user);
        localStorage.setItem('uid', user.user.uid);
        this.getUser(user.user.uid);
        this._router.navigate(['/profile']);
      });
  }

  
  private getUser(userId:string) {
    this.fs
      .collection('Users')
      .ref.doc(userId)
      .get()
      .then((data) => {
        this.dataProfile = data.data();
        // console.log(this.dataProfile);
        this._chatStream.stupChannel(this.dataProfile?.userId,this.dataProfile?.firstName +' '+this.dataProfile?.lastName,this.dataProfile?.imageProfile);
      });
  }


}
