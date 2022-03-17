import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { AuthService } from 'src/app/services/auth.service';

export function passwordsMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordsDontMatch: true };
    } else {
      return null;
    }
  };
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  signUpForm = new FormGroup(
    {
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(
          '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{5,}'
        ),
      ]),
      confirmPassword: new FormControl('', Validators.required),
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      birthDate: new FormControl('', [Validators.required]),
      mobile: new FormControl('', [
        Validators.required,
        Validators.pattern(
          '^01(1|0|2|5)[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]$'
        ),
      ]),
      doctor: new FormControl('', [Validators.required]),
      male: new FormControl('', [Validators.required]),
    },
    { validators: passwordsMatchValidator() }
  );
  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: HotToastService,
    private _router: Router,
    private fs: AngularFirestore
  ) {}
  ngOnInit(): void {}

  get email() {
    return this.signUpForm.get('email');
  }

  get password() {
    return this.signUpForm.get('password');
  }

  get confirmPassword() {
    return this.signUpForm.get('confirmPassword');
  }
  get firstName() {
    return this.signUpForm.get('firstName');
  }

  get lastName() {
    return this.signUpForm.get('lastName');
  }

  get birthDate() {
    return this.signUpForm.get('birthDate');
  }

  get mobile() {
    return this.signUpForm.get('mobile');
  }

  get doctor() {
    return this.signUpForm.get('doctor');
  }

  get male() {
    return this.signUpForm.get('male');
  }

  submit() {
    if (!this.signUpForm.valid) {
      return;
    }

    const {
      email,
      password,
      firstName,
      lastName,
      birthDate,
      mobile,
      doctor,
      male,
    } = this.signUpForm.value;
    // console.log(this.signUpForm.value);

    this.authService
      .registerWithEmail(email, password)
      .pipe(
        this.toast.observe({
          success: 'Signed in successfully',
          loading: 'Signing in...',
          error: ({ message }) => `There was an error: ${message} `,
        })
      )
      .subscribe((user) => {
        localStorage.setItem('uid', user.user?.uid);
        // console.log('Done');
        this.fs
          .collection('Users')
          .doc(user.user?.uid)
          .set({
            firstName: this.firstName?.value,
            lastName: this.lastName?.value,
            mobile: this.mobile?.value,
            birthDate: this.birthDate?.value,
            male: this.male?.value,
            doctor: this.doctor?.value,
            email: this.email?.value,
            userId: user.user?.uid,
            imageProfile: '',
          })
          .then(() => {
            this._router.navigate(['/profile']);
          });
      });
  }
}
