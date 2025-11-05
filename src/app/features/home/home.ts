import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {

  admin():boolean{
    if(localStorage.getItem('currentUserAdmin') == 'true'){
      return true;
    }else{
      return false;
    }
  }
}
