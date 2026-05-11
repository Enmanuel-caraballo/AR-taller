import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-item-management',
  templateUrl: './item-management.page.html',
  styleUrls: ['./item-management.page.scss'],
  standalone: false
})
export class ItemManagementPage implements OnInit {

  data!: { code: string }

  

  constructor( private readonly router: Router) {

    const navigation = this.router.getCurrentNavigation();

    if (navigation?.extras?.state) {

      this.data = navigation.extras.state['data'];

    }

   }

  ngOnInit() {
  }

}
