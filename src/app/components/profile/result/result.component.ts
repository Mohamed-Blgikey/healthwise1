import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ResultsService } from 'src/app/services/results.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {

  user:any;
  result:any;
  id:string='';
  constructor(private _resultservices:ResultsService,private route:ActivatedRoute,private auth:AuthService) {
    this.id = this.route.snapshot.params['id'];

  }

  ngOnInit(): void {


    // console.log(this.id);
    this._resultservices.GetResult(this.id).then(res=>{
      // console.log(res.data());
      this.result = res.data()
      this.auth.GetUserById(this.result.userId).then(res=>{
      // console.log(res.data());
        this.user = res.data();
      })
    })


  }

}
