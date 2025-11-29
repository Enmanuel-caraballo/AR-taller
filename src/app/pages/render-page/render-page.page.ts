import { AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-render-page',
  templateUrl: './render-page.page.html',
  styleUrls: ['./render-page.page.scss'],
  standalone: false
})
export class RenderPagePage implements OnInit {

  constructor() { }

  async ngOnInit() {
   const targets = [ { name: 'Target 1', path: 'assets/targets/target1/image', type: 'box' },
      { name: 'Target 2', path: 'assets/targets/target2/image', type: 'text' },
       { name: 'Target 3', path: 'assets/targets/target3/image', type: 'sphere' } ];
       }
  }



