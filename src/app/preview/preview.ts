import { Component } from '@angular/core';
import { Service } from '../@service/service';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-preview',
  imports: [CommonModule],
  templateUrl: './preview.html',
  styleUrl: './preview.scss'
})
export class Preview {
  name = '';
  text = '';
  start = '';
  end = '';
  questions: any[] = [];
  answers: any[] = [];
  id!:number;
  constructor(private location: Location,private service: Service,private route:ActivatedRoute,private router:Router) {}

  username = '';
  userphone = '';
  usermail = '';
  userage = '';
  backcheck = false;

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id')); // ✅ 先拿 id

    const index = Number(this.route.snapshot.queryParamMap.get('submissionIndex'));
    const dataList = this.service.getPreviewData(this.id); // ✅ 現在 id 有值了

    const data = dataList[index];
    if (data) {
      this.name = data.name;
      this.text = data.text;
      this.start = data.start;
      this.end = data.end;
      this.questions = data.questions;
      this.answers = data.answers;

      if (data.user) {
        this.username = data.user.username;
        this.userphone = data.user.userphone;
        this.usermail = data.user.usermail;
        this.userage = data.user.userage;
      }
    }
    this.route.queryParams.subscribe((params)=>{
      const back = params['backcheck'];
      if(back){
        this.backcheck=true;
      }
    });
  }
  go_pre(){
    if(this.backcheck){
      this.router.navigate(['./feedback']);
      this.backcheck=true;
    }else{
      this.router.navigate(['/question', this.id], { queryParams: { fromPreview: true } });
    }
  }
  go_back(){
    this.router.navigate(['./back']);
  }
  go_statistics(id: number) {
    this.router.navigate(['/singlestatistics', id]);
  }
}
