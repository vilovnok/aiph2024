import { Component, OnInit} from '@angular/core';
import { UserService } from '../services/user.service';
import { FormBuilder, FormControl } from '@angular/forms';
import { MessageModel } from '../models/message/message';

@Component({
  selector: 'app-main',

  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit{

  prompt: string = '';
  messages: MessageModel[] = [];
  istyping: boolean = false;
  public sleep = (ms: number): Promise<void> => {return new Promise((r) => setTimeout(r, ms));}
  
  constructor(private service: UserService, private fb: FormBuilder) { }
  
  ngOnInit(): void {this.getMessages();}

  getMessages(): void {
    this.service.getMessages().subscribe(
      data =>this.messages = data['message']);
  }

  async sendMessage() {
    this.messages.push({'text': this.prompt, 'type': 'human'})  
    const promptToSend = this.prompt;
    this.prompt = '';      
    await this.sleep(2000);   
    this.istyping = true; 
    if (promptToSend) {
      const data = this.fb.group({ prompt: promptToSend });
      this.service.handle_post_requests(data.value, 'generateText').subscribe(response => {
        this.checkTaskStatus(response['task_id']);        
      }, async (err) => {
        await this.sleep(2000);
        this.istyping = false;
        this.messages.push({'text': "Извините, мы позже вернемся к Вашему вопросу.", 'type': 'bot'})  
        console.error('Error sending message: ', err);        
      });
    }
  }

  async checkTaskStatus(task_id: string) {
    await this.sleep(5000)
    this.service.handle_get_requests(task_id, 'task').subscribe(response => {
      console.log(response);
      this.istyping = false;
      this.messages.push({'text': response['result'], 'type': 'bot'})
    });
  }
}



