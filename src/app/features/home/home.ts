import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {

  admin(): boolean {
    if (localStorage.getItem('currentUserAdmin') == 'true') {
      return true;
    } else {
      return false;
    }
  }

  scrollToBottom(): void {
    const scrollHeight = document.documentElement.scrollHeight;
    const viewportHeight = window.innerHeight;

    window.scrollTo({
      top: scrollHeight - viewportHeight,
      behavior: 'smooth'
    });
  }

  scrollToTop(): void {
    const scrollHeight = document.documentElement.scrollHeight;
    const viewportHeight = window.innerHeight;

    window.scrollTo({
      top: viewportHeight - scrollHeight,
      behavior: 'smooth'
    });
  }


}
