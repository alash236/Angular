
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Service } from '../@service/service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { format } from 'date-fns';

@Component({
  selector: 'app-question',
  imports: [CommonModule,FormsModule],
  templateUrl: './question.html',
  styleUrl: './question.scss'
})
export class Question {

  constructor(private service:Service,private router:Router,private route:ActivatedRoute){}

  name:string='';
  text:string='';
  start:string='';
  end:string='';
  username='';
  userphone='';
  usermail='';
  userage='';
  questionList:any[]=[];
  answerList:any[] = [];
  userList:string[]=[];

  question_ID:number=0;
  ngOnInit(): void {
    this.question_ID = Number(this.route.snapshot.paramMap.get('id'));

    this.route.queryParams.subscribe(params => {
      const fromPreview = params['fromPreview'];
      const submissionIndex = Number(params['submissionIndex']);

      if (!fromPreview) {
        // 非從預覽頁回來，才清空資料
        this.service.clearAnswers(this.question_ID);
        const existing = this.service.getPreviewData(this.question_ID);
        if (existing) {
          existing.user = {
            usertime:'',
            username: '',
            userphone: '',
            usermail: '',
            userage: ''
          };
        }
    }
      // 讀取答案（如果有）
      const savedAnswers = this.service.getAnswers(this.question_ID);

      // 初始化資料
      this.questionList = [];
      this.answerList = [];

      for (let data of this.service.getQuestions()) {
        if (data.questionID == this.question_ID) {
          this.name = data.questionTitle.questionName;
          this.text = data.questionTitle.questionText;
          this.start = data.questionTitle.questionStart;
          this.end = data.questionTitle.questionEnd;

          for (let i = 0; i < data.questionTopic.length; i++) {
            const topic = data.questionTopic[i];
            this.questionList.push({
              question_name: topic.questionName,
              question_answer: topic.questionAnswer,
              question_answerType: topic.questionAnswerType,
              question_click: topic.questionClick
            });

            if (savedAnswers.length > 0 && savedAnswers[i]) {
              this.answerList.push(savedAnswers[i]);
            } else {
              this.answerList.push({ value: topic.questionAnswerType === 'M' ? [] : '' });
            }
          }
          break;
        }
      }
      const previewData = this.service.getPreviewData(this.question_ID);
      if (previewData && previewData[submissionIndex] &&previewData[submissionIndex].user) {
        const user = previewData[submissionIndex].user;
        this.username = user.username || '';
        this.userphone = user.userphone || '';
        this.usermail = user.usermail || '';
        this.userage = user.userage || '';
      }

    });
  }

  preview(){
  if (this.username === '' || this.userphone === '' || this.userphone.length !== 10) {
    alert('資訊格式不完整，請重新輸入');
    this.username = '';
    this.userphone = '';
    return;
  }

  for (let i = 0; i < this.questionList.length; i++) {
    const question = this.questionList[i];
    const answer = this.answerList[i]?.value;

    if (question.question_click) {
      if ((question.question_answerType === 'S' || question.question_answerType === 'T') && !answer) {
        alert(`第 ${i + 1} 題為必填，請填寫`);
        return;
      }

      if (question.question_answerType === 'M' && Array.isArray(answer) && answer.length === 0) {
        alert(`第 ${i + 1} 題為必填，請至少選擇一個選項`);
        return;
      }
    }
  }
      this.service.updateStatistics(this.question_ID, this.answerList);
      this.service.setAnswers(this.question_ID, this.answerList);
      const previewData = {
        name: this.name,
        text: this.text,
        start: this.start,
        end: this.end,
        questions: this.questionList,
        answers: this.answerList,
        user: {
          usertime:format(new Date(),'yyyy-MM-dd hh:mm'),
          username: this.username,
          userphone: this.userphone,
          usermail: this.usermail,
          userage: this.userage
        }
      };

      const previews = this.service.getPreviewData(this.question_ID) || [];
      const isDuplicate = previews.some((p: { answers: any; user: { username: string; userphone: string; }; }) =>
        JSON.stringify(p.answers) === JSON.stringify(previewData.answers) &&
        p.user?.username === previewData.user.username &&
        p.user?.userphone === previewData.user.userphone
      );
      if (!isDuplicate) {
        this.service.setPreviewData(this.question_ID, previewData);
      }
      const submissions = this.service.getPreviewData(this.question_ID);
      const currentIndex = submissions.length - 1;
      this.router.navigate(['./preview', this.question_ID], {
        queryParams: { submissionIndex: currentIndex }
      });
  }

  onCheckboxChange(event: any, index: number, value: string) {
    const selectedAnswers = this.answerList[index].value;

    if (event.target.checked) {
      if (!selectedAnswers.includes(value)) {
        selectedAnswers.push(value);
      }
    } else {
      const i = selectedAnswers.indexOf(value);
      if (i !== -1) {
        selectedAnswers.splice(i, 1);
      }
    }
  }
  go_front(){
    this.router.navigate(['./front']);
  }
}
