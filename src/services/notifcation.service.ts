import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import * as signalR from '@microsoft/signalr';
import Swal from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class NotifcationService {
  private signalRUrl=environment.signalRUrl;
  private hubConnection: signalR.HubConnection;
  message: string = '';



  constructor() {
    this.hubConnection = new signalR.HubConnectionBuilder()
    .withUrl(`${this.signalRUrl}/notificationHub` , {
      transport: signalR.HttpTransportType.WebSockets,
      withCredentials: true // ✅ Include credentials
    } )
    .withAutomaticReconnect()
    .build();

    this.hubConnection.start()
      .then(() => console.log('SignalR Connected'))
      .catch(err => console.error('SignalR Error:', err));

      this.hubConnection.on('StockLowNotification', (message: string) => {
       console.log('StockLowNotification:', message);
      });  
   }
}
