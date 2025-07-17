import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class Service {

  private storageKey = 'question_data';

  private questionData = new BehaviorSubject<any[]>(this.getQuestions());

  constructor() {
     window.addEventListener('storage', (event) => {
      if (event.key === this.storageKey) {
        const updatedData = this.getQuestions();
        this.questionData.next(updatedData);
      }
     });
  }

  _questionData = this.questionData.asObservable();


  //Question
  setQuestions(data: any[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  getQuestions(): any[] {
    const storedData = localStorage.getItem(this.storageKey);
    return storedData ? JSON.parse(storedData) : [];
  }

  deleteQuestion(index: number) {
    const data = this.getQuestions();
    data.splice(index, 1);
    this.setQuestions(data);
  }

  //Answer
  setAnswers(questionId:number,data: any[]) {
    localStorage.setItem(`answer_data_${questionId}`, JSON.stringify(data));
  }

  getAnswers(questionId:number): any[] {
    const stored = localStorage.getItem(`answer_data_${questionId}`);
    return stored ? JSON.parse(stored) : [];
  }

  clearAnswers(id: number) {
    localStorage.removeItem(`answer_data_${id}`);
  }

  //PreviewData
  setPreviewData(id: number, submission: any) {
    const key = `preview_data_${id}`;
    const stored = localStorage.getItem(key);
    let data = stored ? JSON.parse(stored) : [];

    if (!Array.isArray(data)) {
      data = [data];
    }

    data.push(submission);
    localStorage.setItem(key, JSON.stringify(data));
  }

  getPreviewData(id: number): any {
    const stored = localStorage.getItem(`preview_data_${id}`);
    const data = stored ? JSON.parse(stored) : [];
    return Array.isArray(data) ? data : [data];
  }

  clearPreviewData(questionId: number) {
    localStorage.removeItem(`preview_data_${questionId}`);
  }

  private previewQuestion: any = null;

  setPreviewQuestion(data: any) {
    this.previewQuestion = data;
  }

  getPreviewQuestion() {
    return this.previewQuestion;
  }

  clearPreviewQuestion() {
    this.previewQuestion = null;
  }

  private questions: any[] = [];
  getQuestion() {
    return this.questions;
  }
  setQuestion(data: any[]) {
    this.questions = data;
  }

  //Statistics
  updateStatistics(questionId: number, answers: any[]) {
    const allQuestions = this.getQuestions();

    const q = allQuestions.find(q => q.questionID === questionId);
    if (!q) return;

    for (let i = 0; i < q.questionTopic.length; i++) {
      const topic = q.questionTopic[i];
      const userAnswer = answers[i].value;

      if (!topic.question_click) {
        topic.question_click = {};
      }

      if (topic.questionAnswerType === 'M') {
        for (let ans of userAnswer) {
          topic.question_click[ans] = (topic.question_click[ans] || 0) + 1;
        }
      } else {
        topic.question_click[userAnswer] = (topic.question_click[userAnswer] || 0) + 1;
      }
    }

    // ✅ 加這行！寫回 localStorage
    this.setQuestions(allQuestions);
  }

  private submittedSet = new Set<number>();

  submitOnce(questionId: number, answers: any[]) {
    if (!this.submittedSet.has(questionId)) {
      this.updateStatistics(questionId, answers);
      this.submittedSet.add(questionId);
    }
  }

}
