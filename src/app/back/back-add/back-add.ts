import { Service } from './../../@service/service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { addDays, format } from 'date-fns'
import {MatTabsModule} from '@angular/material/tabs';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-back-add',
  imports: [MatIconModule,FormsModule,CommonModule,MatTabsModule,MatFormFieldModule, MatSelectModule, MatInputModule],
  templateUrl: './back-add.html',
  styleUrl: './back-add.scss'
})

export class BackAdd {
  constructor(private router:Router,private service:Service){}

  question_data:any[]=[];

  new_question_data:any={
    question_ID:Math.floor(Math.random()*50),
    props:{
      question_name:'',
      question_text:'',
      question_state:'',
      date_start:'',
      date_end:'',
      date_write:false,
      questionName:'',
      question_answer:[],
      question_answer_type:'',
      question_isTrue:false
    }
  }

  today:string = '';
  maxStartTime:string = '';
  maxEndTime:string = '';
  isChecked:boolean=false;

  ngOnInit(): void {
    this.today = format(new Date(),'yyyy-MM-dd');
    this.maxStartTime = format(addDays(new Date(),2),'yyyy-MM-dd');
    this.maxEndTime = format(addDays(new Date(),7),'yyyy-MM-dd');
  }

  question_set_next(){





        if(this.today >= this.new_question_data.props.date_start && this.today <= this.new_question_data.props.date_end){
          this.new_question_data.props.question_state = '進行中';
        }else if(this.today < this.new_question_data.props.date_start){
          this.new_question_data.props.question_state = '尚未開始';
        }else if(this.today > this.new_question_data.props.date_end){
          this.new_question_data.props.question_state = '結束';
        }

        if(this.new_question_data.props.question_state=='進行中'){
          this.new_question_data.props.date_write= true;
        }else{
          this.new_question_data.props.date_write = false;
        }

        this.question_data = this.service.getQuestions();

        this.question_data.push({ ...this.new_question_data });

        this.service.setQuestions(this.question_data);

        this.new_question_data={
          question_ID:0,
          props:{
            question_name:'',
            question_text:'',
            question_state:'',
            date_start:'',
            date_end:'',
            date_write:false,
            question:[{
              questionName:'',
              question_answer:[],
              question_answer_type:'',
              question_isTrue:false
            }]
          }
        };
       this.router.navigate(['/back']);

}

  question_set_cancel(){
    this.router.navigate(['/back'])
  }

  add_question(){

    this.new_question_data.props.question_answer.push('');
    if(this.isChecked){
      this.new_question_data.props.question_isTrue = true;
    }else{
      this.new_question_data.props.question_isTrue = false;
    }
  }

}

