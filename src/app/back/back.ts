import { Component, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Service } from '../@service/service';
import { FormsModule } from '@angular/forms';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import { addDays, format } from 'date-fns';

@Component({
  selector: 'app-back',
  providers: [provideNativeDateAdapter()],
  imports: [FormsModule,CommonModule,MatTableModule, MatPaginatorModule,MatIconModule,MatButtonModule, MatDividerModule],
  templateUrl: './back.html',
  styleUrl: './back.scss'
})
export class Back {
  search_name:string="";
  search_start_time:string="";
  search_end_time:string="";
  searchArray:any[]=[];

  displayedColumns: any[] = ['question_ID','question_name','question_state','date_start','date_end','action'];

  dataSource = new MatTableDataSource<any>();

  today:string='';
  maxStartTime:string='';
  maxEndTime:string='';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private service:Service,private router:Router){}

  ngOnInit(): void {
    this.today = format(new Date(),"yyyy-MM-dd");
    this.maxStartTime = format(addDays(new Date(),2),'yyyy-MM-dd');
    this.maxEndTime = format(addDays(new Date(),7),'yyyy-MM-dd');
    this.searchArray = this.service.getQuestions();
    this.dataSource.data = this.service.getQuestions();
    for(let datas of this.dataSource.data){
      if(datas.questionTitle.questionStart <= this.today && datas.questionTitle.questionEnd >= this.today){
        datas.questionTitle.questionState = '進行中';
      }else if(this. today < datas.questionTitle.questionStart){
        datas.questionTitle.questionState = '尚未開始';
      }else if(this. today > datas.questionTitle.questionEnd){
        datas.questionTitle.questionState='結束';
      }
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  search_name_function() {
    const tidyData = this.searchArray.filter(res => {
      const matchesName = this.search_name === '' || res.questionTitle.questionName.includes(this.search_name);
      const matchesStart = this.search_start_time === '' || res.questionTitle.questionStart >= this.search_start_time;
      const matchesEnd = this.search_end_time === '' || res.questionTitle.questionEnd <= this.search_end_time;
      return matchesName && matchesStart && matchesEnd;
    });
    this.dataSource.data = tidyData;
  }

  go_statistics(){
    this.router.navigate(['/statistics']);
  }

  go_feedback(){
    this.router.navigate(['./feedback']);
  }

  add(){
    this.router.navigate(['/back/add']);
  }

  login_out(){
    alert("已登出！");
    this.router.navigate(['/front']);
  }

  delete(index: number) {
    this.service.deleteQuestion(index);
    this.dataSource.data=this.service.getQuestions();
  }

}

