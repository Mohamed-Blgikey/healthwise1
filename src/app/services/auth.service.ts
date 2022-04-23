import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { signInWithEmailAndPassword } from '@firebase/auth';
import { BehaviorSubject, from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = new BehaviorSubject(null);
  constructor(private _angularFireAuth: AngularFireAuth,private fs:AngularFirestore) {}

  GetUser(){
    return this.fs.collection("Users").ref.doc(localStorage.getItem('uid')?.toString()).get()
  }

  GetUserById(id:any){
    return this.fs.collection("Users").ref.doc(id).get()
  }

  GetAllUsers(){
    return this.fs.collection("Users").valueChanges()
  }

  loginByEmail(email: string, password: string): Observable<any> {
    return from(
      this._angularFireAuth.signInWithEmailAndPassword(email, password)
    );
  }

  registerWithEmail(email: string, password: string): Observable<any> {
    return from(
      this._angularFireAuth.createUserWithEmailAndPassword(email, password)
    );
  }
}
