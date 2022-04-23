import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ResultsService } from 'src/app/services/results.service';

@Component({
  selector: 'app-userdetails',
  templateUrl: './userdetails.component.html',
  styleUrls: ['./userdetails.component.scss']
})
export class UserdetailsComponent implements OnInit {

  id : any;
  dataProfile:any;
  userResults:any;
  constructor(private active:ActivatedRoute,private auth:AuthService, private result:ResultsService) { }

  ngOnInit(): void {
    this.id = this.active.snapshot.params['id']
    console.log(this.id);

    this.auth.GetUserById(this.id).then(res=>{
      this.dataProfile = res.data();
    })


    this.result.GetAllResults().subscribe((res) => {
      // console.log(res);
      this.userResults = res.filter((r: any) => {
        return r.userId == this.id;
      });
      // console.log(this.userResults);
    });
  }


}
