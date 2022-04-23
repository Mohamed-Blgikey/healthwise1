import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { finalize, switchMap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ChatStreamService } from 'src/app/services/chat-stream.service';
import { ResultsService } from 'src/app/services/results.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  check: boolean = true;
  visable: boolean = false;
  dataProfile: any = '';
  userResults: any;
  userId = localStorage.getItem('uid');
  users:any;

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
    department: new FormControl('', [Validators.required]),
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
    private toast: HotToastService,
    private _chatStream: ChatStreamService,
    private _resultservices: ResultsService
  ) {}

  ngOnInit(): void {
    this.getUser();

    this._resultservices.GetAllResults().subscribe((res) => {
      // console.log(res);
      this.userResults = res.filter((r: any) => {
        return r.userId == localStorage.getItem('uid')?.toString();
      });
      // console.log(this.userResults);
    });

    this.auth.GetAllUsers().subscribe((res) => {
      // console.log(res);
      this.users= res.filter((u:any)=>{
        return u.email != "admin@admin.com" && u.doctor == false
      })
      // console.log(this.users);

    });
  }

  submit() {
    // console.log(this.updateForm.value);
    let doctorState;
    let maleState;

    if (this.updateForm.controls['doctor'].value == 'true' ||  this.updateForm.controls['doctor'].value == true) {
      doctorState = true;
    } else {
      doctorState = false;
    }
    if (this.updateForm.controls['male'].value == 'true' ||  this.updateForm.controls['male'].value == true) {
      maleState = true;
    } else {
      maleState = false;
    }

    // console.log(doctorState,maleState);

    this.fs
      .collection('Users')
      .doc(this.dataProfile.userId)
      .update({
        firstName: this.updateForm.controls['firstName'].value,
        lastName: this.updateForm.controls['lastName'].value,
        mobile: this.updateForm.controls['mobile'].value,
        birthDate: this.updateForm.controls['birthDate'].value,
        department: this.updateForm.controls['department'].value,
        doctor: doctorState,
        male: maleState,
      })
      .then(() => {
        this.getUser();
      })
      .then(() => {
        this._chatStream.stupChannel(
          this.dataProfile?.userId,
          this.dataProfile?.firstName + ' ' + this.dataProfile?.lastName,
          this.dataProfile?.imageProfile
        );
        this.auth.user.next(this.dataProfile);
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
    this.visable = true;
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
                  this.visable = false;
                  this.getUser();
                })
                .then(() => {
                  this._chatStream.stupChannel(
                    this.dataProfile?.userId,
                    this.dataProfile?.firstName +
                      ' ' +
                      this.dataProfile?.lastName,
                    this.dataProfile?.imageProfile
                  );
                  this.auth.user.next(this.dataProfile);
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
  get department() {
    return this.updateForm.get('department');
  }

  private getUser() {
    this.auth.GetUser().then((data) => {
      this.dataProfile = data.data();
      // console.log(this.dataProfile);
      this.updateForm.controls['firstName'].setValue(
        this.dataProfile.firstName
      );
      this.updateForm.controls['lastName'].setValue(this.dataProfile.lastName);
      this.updateForm.controls['mobile'].setValue(this.dataProfile.mobile);
      this.updateForm.controls['birthDate'].setValue(
        this.dataProfile.birthDate
      );
      this.updateForm.controls['doctor'].setValue(this.dataProfile.doctor);
      this.updateForm.controls['male'].setValue(this.dataProfile.male);
      this.updateForm.controls['department'].setValue(
        this.dataProfile.department
      );
    });
  }
}
