import { Component } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { RouterOutlet } from '@angular/router';
import { Footer } from "../footer/footer";

@Component({
  selector: 'app-structure',
  imports: [Navbar, RouterOutlet, Footer],
  templateUrl: './structure.html',
  styleUrl: './structure.scss'
})
export class Structure {

}
