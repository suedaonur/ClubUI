import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../core/services/chat.service';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.css'
})
export class ChatbotComponent {
  private chatService = inject(ChatService);
  
  question: string = '';
  answer: string | null = null;
  isLoading: boolean = false;
  error: string | null = null;

  askQuestion() {
    if (!this.question.trim()) return;

    this.isLoading = true;
    this.error = null;
    this.answer = null;

    this.chatService.askQuestion(this.question).subscribe({
      next: (response) => {
        this.answer = response.answer;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Bir hata oluştu. Lütfen tekrar deneyin.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }
}
