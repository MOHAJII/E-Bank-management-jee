import {Component, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {Customer} from '../models/customer.model';
import {CustomerService} from '../services/customer.service';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

}
