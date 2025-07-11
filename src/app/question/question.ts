import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Service } from '../@service/service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-question',
  imports: [CommonModule],
  templateUrl: './question.html',
  styleUrl: './question.scss'
})
export class Question {
  constructor(private service:Service,private route: ActivatedRoute){}

  question_ID: number = 0;
  question: any;
  questionName:string='';
  question_answer:any=[];
  question_answer_type:string='';

  ngOnInit(): void {
    this.question_ID = Number(this.route.snapshot.paramMap.get('id'));
    const questions = this.service.getQuestions();
    console.log(questions);
    this.question = questions.find(q => q.question_ID === this.question_ID);
    if(this.question){
      this.questionName = this.question.props.questionName;
      this.question_answer = this.question.props.qustion_answer;
      this.question_answer_type = this.question.props.qustion_answer_type;
    }
  }

}
