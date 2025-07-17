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
  titleCheck: boolean = false;
  selectedTabIndex = 0;
  constructor(private router:Router,private service:Service){}

  QuestionData:any[]=[];

  question={
    questionID:0,

    questionTitle:{
      questionName:'',
      questionText:'',
      questionState:'',
      questionStart:'',
      questionEnd:'',
      questionTF:false
    },
    questionTopic:[{
      questionName:'',
      questionAnswerType:'',
      questionAnswer:[] as any,
      questionClick:false
      }]
  }


  today:string='';
  maxStartTime:string='';
  maxEndTime:string='';
  questionTopicClick:boolean=false;
  ngOnInit(): void {
    this.today = format(new Date(),'yyyy-MM-dd');
    this.maxStartTime = format(addDays(new Date(),2),'yyyy-MM-dd');
    this.maxEndTime = format(addDays(new Date(),7),'yyyy-MM-dd');
  }
  questionTitleCheck(){
    let res:string = '';
    if(this.question.questionTitle.questionName=='')res+="問卷名稱不能為空\n";
    if(this.question.questionTitle.questionText=='')res+="問卷敘述不能為空\n";
    if(this.question.questionTitle.questionStart=='')res+="開始時間不能為空\n";
    if(this.question.questionTitle.questionEnd=='')res+="結束時間不能為空\n";
    if(this.question.questionTitle.questionStart > this.question.questionTitle.questionEnd)res+="開始時間不能大於結束時間\n";
    if(res!=''){
      alert(res);
      this.question.questionTitle.questionName='';
      this.question.questionTitle.questionText='';
      this.question.questionTitle.questionStart='';
      this.question.questionTitle.questionEnd=='';
    }else{
      this.titleCheck = true;
      this.selectedTabIndex = 1;
    }
  }

  questionTopicCheck(){

    if(this.question.questionTitle.questionStart<=this.today && this.question.questionTitle.questionEnd >= this.today){
      this.question.questionTitle.questionState="進行中";
      this.question.questionTitle.questionTF = true;
    }else if(this.today < this.question.questionTitle.questionStart){
      this.question.questionTitle.questionState="尚未開始";
    }else if(this.today > this.question.questionTitle.questionEnd){
      this.question.questionTitle.questionState="結束";
    }

    this.QuestionData = this.service.getQuestions();
    const maxId = this.QuestionData.reduce((max, q) => q.questionID > max ? q.questionID : max, 0);
    this.question.questionID = maxId + 1;

    this.service.setPreviewQuestion(this.question);
    this.router.navigate(['./back/add/question_preview', this.question.questionID]);
  }
  questionTopicCancel(){
    this.titleCheck=false;
    this.selectedTabIndex=0;
  }

  deleteAnswer(topicIndex: number, answerIndex: number) {
    this.question.questionTopic[topicIndex].questionAnswer.splice(answerIndex, 1);
  }

  AddTopic(){
    this.question.questionTopic.push({
      questionName: '',
      questionAnswerType: 'S',
      questionAnswer: ["",""],
      questionClick: false
    });
  }
  AddAnswer(index:number){
    console.log(index)
    this.question.questionTopic[index].questionAnswer.push("");
  }
  onAnswerTypeChange(index: number) {
  const type = this.question.questionTopic[index].questionAnswerType;
  if (type === 'T') {
    this.question.questionTopic[index].questionAnswer = [];
  } else {
    if (!this.question.questionTopic[index].questionAnswer || this.question.questionTopic[index].questionAnswer.length === 0) {
      this.question.questionTopic[index].questionAnswer = ['', ''];
    }
  }
}
removeAnswer(topicIndex: number, answerIndex: number) {
  const answers = this.question.questionTopic[topicIndex].questionAnswer;
  if (answers.length > 2) {
    answers.splice(answerIndex, 1);
  } else {
    alert('至少要保留二個答案');
  }
}

  deleteTopic(index:number){
    const confirmDelete = confirm(`確定要刪除第 ${index + 1} 題嗎？`);
    if (confirmDelete) {
      this.question.questionTopic.splice(index, 1);
    }
  }
  questionTitleCancel(){
    this.router.navigate(['./back']);
  }

}

