import { Component } from '@angular/core';
import { ChatbotService } from '../chatbot.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-chatbot',
  imports: [CommonModule,FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.css'
})
export class ChatbotComponent {
  messages: { user: boolean; text: string }[] = [];
  userMessage: string = '';

  constructor(private chatbotService: ChatbotService) {}
  //constructor() {}

  sendMessage() {
    if (!this.userMessage.trim()) return;

    this.messages.push({ user: true, text: this.userMessage });
     this.chatbotService.sendMessage(this.userMessage).subscribe((response: any) => {
       const botMessage = response.queryResult.fulfillmentText;
       this.messages.push({ user: false, text: botMessage });
     });

    // Simulate bot response
    setTimeout(() => {
      this.messages.push({
        user: false,
        text: `Bot says: "${this.userMessage}"`, // Echo user input as bot response
      });
    }, 1000);

    this.userMessage = '';
  }
}