import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { combineLatest, delay, Observable, of, switchMap, tap } from 'rxjs';
import { UserService } from '../services/user.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-main',

  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {

  chatListControl = new FormControl();
  // messageControl = new FormControl();

  prompt:string = ''; 
 
  constructor(private service: UserService, private fb: FormBuilder){}

  delay(ms: number) {
    console.log('TIME DELAY');
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  sendMessage() {
    const data = this.fb.group({prompt: this.prompt});
    console.log('Сообщение отправлено! ', this.prompt);
    if (this.prompt) {    
      this.service.handle_post_requests(data.value,'generateText').subscribe(result =>{
        console.log(result);
        this.prompt = '';
        
        // this.service.handle_get_requests(result['task_id'],'task').subscribe(res => {console.log(res);});        
        this.checkTaskStatus(result['task_id']);
      });
    }
    console.log('Сообщение не отправлено!');
  }


  checkTaskStatus(taskId: string) {
    this.pollTaskStatus(taskId).subscribe({
      next: (res) => {
        console.log('Final response:', res);
      },
      error: (err) => {
        console.error('Error:', err);
      }
    });
  }

  private pollTaskStatus(taskId: string): Observable<any> {
    return this.service.handle_get_requests(taskId, 'task').pipe(
      tap((res) => {
        console.log(res);
      }),
      switchMap((res) => {
        if (res.status === 'Task Pending') {
          // Повторяем запрос после задержки
          return this.pollTaskStatus(taskId).pipe(delay(1000));
        } else {
          // Возвращаем результат, когда задача не находится в состоянии 'Task Pending'
          return of(res);
        }
      })
    );
  }






}
