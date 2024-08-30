import { Component} from '@angular/core';
import { UserService } from '../services/user.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-main',

  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  prompt: string = '';

  constructor(private service: UserService, private fb: FormBuilder) { }

  sendMessage() {
    const data = this.fb.group({ prompt: this.prompt });
    console.log('Сообщение отправлено! ', this.prompt);
    if (this.prompt) {
      this.service.handle_post_requests(data.value, 'generateText').subscribe(response => {
        this.checkTaskStatus(response['task_id']);
        this.prompt = '';
      });
    }
  }

  async checkTaskStatus(task_id: string) {
    const sleep = (ms: number): Promise<void> => {return new Promise((r) => setTimeout(r, ms));}
    await sleep(5000)
    this.service.handle_get_requests(task_id, 'task').subscribe(response => {
      console.log(response);
      this.prompt=response['result'];
    });
  }
}



