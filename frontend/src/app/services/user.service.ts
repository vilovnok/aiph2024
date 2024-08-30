import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { concat, concatMap, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private address = environment.API_BASE_URL;
  constructor(private http: HttpClient) { }

  private _refreshrequired = new Subject<void>();
  get Refreshrequired() {
    return this._refreshrequired;
  }

  handle_post_requests(userObject: any, endpoint: string) {
    return this.http.post<any>(`${this.address}/${endpoint}`, userObject)
  }
  handle_get_requests(userObject: any, endpoint: string) {
    return this.http.get<any>(`${this.address}/${endpoint}/${userObject}`)
  }

  // getCurrentUserProfile$(): Observable<ProfileUser | null> {
  //   return this.authService.currentUser$.pipe(switchMap(() =>{
  //     if (!user?.uid){
  //       return of(null);
  //     }
  //     const ref = doc(this.firestore, 'users', user?.uid);
  //     return docData(ref) as Observable<ProfileUser | null>;
  //   }));
  // }
  // get currentUserProfile$(): Observable<ProfileUser[]> {}   

  // addChatMessage(message: string): Observable<any>{
  //   return
  // }

  // addChatMessage(chatId: string, message: string): Observable<any> {
  //   const ref = collection(this.firestore, 'chats', chatId, 'messages');
  //   const chatRef = doc(this.firestore, 'chats', chatId);
  //   return this.userService.currentUserProfile$.pipe(take(1),
  //     concatMap((user) => addDoc(ref, { text: message, senderId: user?.uid }

  //     )
  //     ),concatMap(() => updateDoc(chatRef, {lastMessage: message}))
  //   )
  // }



}
