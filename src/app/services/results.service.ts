import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class ResultsService {

  constructor(private fs :AngularFirestore) { }
  GetAllResults(){
    return this.fs.collection("Results").valueChanges()
  }

  GetResult(id:string){
    return this.fs.collection("Results").ref.doc(id).get()
  }
}
