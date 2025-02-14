import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TensorflowPredictComponent } from "../tensorflow-predict/tensorflow-predict.component";
import { FormsModule } from '@angular/forms';
import { AdditionRnnComponent } from "../addition-rnn/addition-rnn.component";
import { ProjectorCalibrationComponent } from "../projector-calibration/projector-calibration.component"; // Import FormsModule
import { CommonModule } from '@angular/common';
import { ChatbotComponent } from '../chatbot/chatbot.component';
import { TranslationComponent } from "../translation/translation.component";
import { HttpClient } from '@angular/common/http';
import { TensorflowOpencvDemoComponent } from '../tensorflow-opencv-demo/tensorflow-opencv-demo.component';



@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TensorflowPredictComponent, FormsModule, ProjectorCalibrationComponent, CommonModule, ChatbotComponent, TranslationComponent, TensorflowOpencvDemoComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Machine Learning Demo App ';
  currentComponent: string | null = null; // Tracks the currently displayed component
  constructor(private http: HttpClient) {}
  ngOnInit(): void {
    console.log('HttpClient Injection Successful:', this.http ? 'Yes' : 'No');
  }
  // Method to set the current component based on button clicks
  showComponent(componentName: string) {
    this.currentComponent = componentName;
  }
}
