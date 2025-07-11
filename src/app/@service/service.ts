import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class Service {
  private storageKey = 'question_data';

  private storageAnswer = 'question_choose';

  constructor() {}

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
}
