import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { signInWithEmailAndPassword } from '@firebase/auth';
import { BehaviorSubject, from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = new BehaviorSubject(null);
  constructor(private _angularFireAuth: AngularFireAuth) {}

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
