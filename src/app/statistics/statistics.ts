import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Service } from '../@service/service';
import { ArcElement, Chart, ChartConfiguration, ChartType, Legend, PieController, Title, Tooltip } from 'chart.js';
import { ActivatedRoute, Router } from '@angular/router';

Chart.register(PieController, ArcElement, Tooltip, Legend, Title);
@Component({
  selector: 'app-statistics',
  imports: [CommonModule],
  templateUrl: './statistics.html',
  styleUrl: './statistics.scss'
})


export class Statistics{

  questionData: any[] = [];
  charts: Chart[] = [];

  constructor(private service: Service,private router:Router,private route:ActivatedRoute) {}

  ngOnInit(): void {
    this.questionData = this.service.getQuestions();
  }
  ngAfterViewInit(): void {
    this.createCharts();
  }

  createCharts() {
    this.questionData.forEach((question, qIndex) => {
      question.questionTopic.forEach((topic: any, tIndex: number) => {
        if ((topic.questionAnswerType === 'M' || topic.questionAnswerType === 'S') && topic.question_click) {
          const labels = Object.keys(topic.question_click);
          const data = Object.values(topic.question_click) as number[];

          const ctx = document.getElementById(`chart-${qIndex}-${tIndex}`) as HTMLCanvasElement;

          if (ctx) {
            const config: ChartConfiguration = {
              type: 'pie' as ChartType,
              data: {
                labels: labels,
                datasets: [{
                  label: topic.questionName,
                  data: data,
                  backgroundColor: labels.map(() => `hsl(${Math.random() * 360}, 70%, 60%)`),
                  borderColor: '#fff',
                  borderWidth: 2
                }]
              },
              options: {
                responsive: true,
                plugins: {
                  legend: {
                    position: 'bottom'
                  },
                  tooltip: {
                    enabled: true
                  },
                  title: {
                    display: true,
                    text: topic.questionName
                  }
                }
              }
            };

            // 如果該位置已有圖表先銷毀，避免重複
            if (this.charts[qIndex * 100 + tIndex]) {
              this.charts[qIndex * 100 + tIndex].destroy();
            }
            this.charts[qIndex * 100 + tIndex] = new Chart(ctx, config);
          }
        }
      });
    });
  }

  ngOnDestroy() {
    // 清除圖表避免記憶體洩漏
    this.charts.forEach(chart => chart.destroy());
  }
  go_back(){
    this.router.navigate(['/back']);
  }
}


