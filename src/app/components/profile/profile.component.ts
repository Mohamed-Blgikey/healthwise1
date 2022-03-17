import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { finalize, switchMap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ImageUplaodService } from 'src/app/services/image-uplaod.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  dataProfile: any;
  userId = localStorage.getItem('uid');

  updateForm = new FormGroup({
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
  });

  imageUpload = new FormGroup({
    caption: new FormControl(''),
    category: new FormControl(''),
    imageUrl: new FormControl(''),
  });
  constructor(
    private fs: AngularFirestore,
    private auth: AuthService,
    private storage: AngularFireStorage,
    private toast: HotToastService
  ) {}

  ngOnInit(): void {
    this.getUser();
  }

  private getUser() {
    this.fs
      .collection('Users')
      .ref.doc(localStorage.getItem('uid')?.toString())
      .get()
      .then((data) => {
        this.dataProfile = data.data();
        // console.log(this.dataProfile);
        this.updateForm.controls['firstName'].setValue(
          this.dataProfile.firstName
        );
        this.updateForm.controls['lastName'].setValue(
          this.dataProfile.lastName
        );
        this.updateForm.controls['mobile'].setValue(this.dataProfile.mobile);
        this.updateForm.controls['birthDate'].setValue(
          this.dataProfile.birthDate
        );
        this.updateForm.controls['doctor'].setValue(this.dataProfile.doctor);
        this.updateForm.controls['male'].setValue(this.dataProfile.male);
      });
  }

  submit() {
    // console.log(this.updateForm.value);
    this.fs
      .collection('Users')
      .doc(this.dataProfile.userId)
      .update({
        firstName: this.updateForm.controls['firstName'].value,
        lastName: this.updateForm.controls['lastName'].value,
        mobile: this.updateForm.controls['mobile'].value,
        birthDate: this.updateForm.controls['birthDate'].value,
        doctor: this.updateForm.controls['doctor'].value,
        male: this.updateForm.controls['male'].value,
      })
      .then(() => {
        this.getUser();
      });
  }

  imgSrc = 'assets/images/image-placeholder.png';
  selectedImage: any = null;
  uploadFile(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => (this.imgSrc = e.target.result);
      reader.readAsDataURL(event.target.files[0]);
      this.selectedImage = event.target.files[0];
    } else {
      this.imgSrc = 'assets/images/image-placeholder.png';
      this.selectedImage = null;
    }
  }

  addImg() {
    if (this.imageUpload.valid) {
      var filePath = `${this.dataProfile?.email}`;
      const fieRef = this.storage.ref(filePath);
      this.storage
        .upload(filePath, this.selectedImage)
        .snapshotChanges()
        .pipe(
          this.toast.observe({
            success: 'Uploaded in successfully',
            loading: 'Uploading in...',
            error: ({ message }) => `There was an error: ${message} `,
          }),
          finalize(() => {
            fieRef.getDownloadURL().subscribe((url) => {
              // console.log(url);
              this.fs
                .collection('Users')
                .doc(this.dataProfile.userId)
                .update({
                  imageProfile: url,
                })
                .then(() => {
                  this.auth.user.next(url);
                  this.getUser();
                });
            });
          })
        )
        .subscribe();
    }
  }

  get confirmPassword() {
    return this.updateForm.get('confirmPassword');
  }
  get firstName() {
    return this.updateForm.get('firstName');
  }

  get lastName() {
    return this.updateForm.get('lastName');
  }

  get birthDate() {
    return this.updateForm.get('birthDate');
  }

  get mobile() {
    return this.updateForm.get('mobile');
  }

  get doctor() {
    return this.updateForm.get('doctor');
  }

  get male() {
    return this.updateForm.get('male');
  }
}
