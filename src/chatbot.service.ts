import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private dialogflowUrl = 'https://dialogflow.googleapis.com/v2/projects/your-project-id/agent/sessions/session-id:detectIntent';

  constructor(private http: HttpClient) {}

  sendMessage(message: string) {
    const body = {
      queryInput: {
        text: {
          text: message,
          languageCode: 'en'
        }
      }
    };
    return this.http.post(this.dialogflowUrl, body);
  }
}