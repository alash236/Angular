import {Component} from '@angular/core';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table'
import { ActivatedRoute, Router } from '@angular/router';
import { Service } from './../@service/service';

@Component({
  selector: 'app-feedback',
  imports: [MatTableModule, MatPaginatorModule],
  templateUrl: './feedback.html',
  styleUrl: './feedback.scss'
})


export class Feedback {
  data:any[]=[];
  idList:number[]=[];
  datas:any[]=[];
  constructor(private service:Service,private router:Router,private route:ActivatedRoute){}

  ngOnInit(): void {
    this.data = this.service.getQuestions();
    this.idList = this.data.map(d => d.questionID); // 確認欄位名稱

    this.datas = [];

  for (let id of this.idList) {
    const previews = this.service.getPreviewData(id);

    const validPreviews = previews
      .map((p: any, i: number) => ({ preview: p, index: i }))
      .filter(({ preview }: { preview: any; index: number }) => {
        const u = preview?.user;
        return u &&
          typeof u.username === 'string' &&
          u.username.trim() !== '' &&
          typeof u.userphone === 'string' &&
          u.userphone.trim().length === 10;
      });

    for (let { preview, index } of validPreviews) {
        const user = preview.user;
        this.datas.push({
          id: id,
          index: index,
          usertime: user.usertime,
          username: user.username,
          usermail: user.usermail,
          userphone: user.userphone,
          userage: user.userage,
          time: user.usertime
        });
    }
  }

    this.datas.sort((a, b) => new Date(b.usertime).getTime() - new Date(a.usertime).getTime());
  }

  go_pre(id:number,index: number){
    this.router.navigate(['./preview',id],{ queryParams: { backcheck: true,submissionIndex: index } });
  }
}

