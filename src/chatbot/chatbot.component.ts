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
  messages: { sender: string, text: string }[] = [];
  userMessage: string = '';

  constructor(private chatbotService: ChatbotService) {}
  //constructor() {}

  sendMessage() {
    if (!this.userMessage.trim()) return;

    // Add user's message
    this.messages.push({ sender: 'user', text: this.userMessage });
    // Send message to Rasa API

    this.chatbotService.sendMessage(this.userMessage).subscribe((response: any) => {
      response.forEach((msg: any) => {
        console.log("msg");
        this.messages.push({ sender: 'bot', text: msg.text });
      });
    });

    // // Simulate bot response
    // setTimeout(() => {
    //   this.messages.push({
    //     user: false,
    //     text: `Bot says: "${this.userMessage}"`, // Echo user input as bot response
    //   });
    // }, 1000);

    this.userMessage = '';
  }
}