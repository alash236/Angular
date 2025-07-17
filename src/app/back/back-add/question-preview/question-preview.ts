import { Router, ActivatedRoute } from '@angular/router';
import { Component } from '@angular/core';
import { Service } from '../../../@service/service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-question-preview',
  imports: [],
  templateUrl: './question-preview.html',
  styleUrl: './question-preview.scss'
})
export class QuestionPreview {
  question: any;
  text: any;
  start: any;
  name: any;
  end: any;
  question_ID: any;
  constructor(private service:Service,private router:Router,private route:ActivatedRoute,private location: Location){}
  questionList:any[]=[];
  ngOnInit(): void {
    this.question = this.service.getPreviewQuestion();

    if (!this.question) {
      alert('資料遺失，返回上一頁');
      this.router.navigate(['./back']);
      return;
    }

    const title = this.question.questionTitle;
    this.name = title.questionName;
    this.text = title.questionText;
    this.start = title.questionStart;
    this.end = title.questionEnd;

    for (let i = 0; i < this.question.questionTopic.length; i++) {
        const topic = this.question.questionTopic[i];
        this.questionList.push({
          question_name: topic.questionName,
          question_answer: topic.questionAnswer,
          question_answerType: topic.questionAnswerType,
          question_click: topic.questionClick
        });
      }
    }

  save(){
    const list = this.service.getQuestions();
    const maxId = list.reduce((max, q) => q.questionID > max ? q.questionID : max, 0);
    this.question.questionID = maxId + 1;
    list.push({ ...this.question });
    this.service.setQuestions(list);
    this.router.navigate(['./back']);
  }
  go_pre(){
    this.service.clearPreviewQuestion();
    this.location.back();
  }

}
