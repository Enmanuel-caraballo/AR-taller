import { Component, OnDestroy, OnInit } from '@angular/core';
import { Auth } from 'src/app/core/providers/auth/auth';
import { Crud } from 'src/app/core/providers/crudFirebase/crud';
import { IFormat } from 'src/app/interfaces/formats.interface';
import { Categories } from 'src/app/shared/services/jsonsProviders';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-start-visit',
  templateUrl: './start-visit.page.html',
  styleUrls: ['./start-visit.page.scss'],
  standalone: false
})
export class StartVisitPage implements OnInit, OnDestroy {
  firstName!: string;

  formatsArray: IFormat[] = [];

  finalFormats: IFormat[] = [];

  department!: string;

  greeting: 'Buenos días' | 'Buenas tardes' | 'Buenas noches' = 'Buenos días';

  currentTime: Date = new Date();
  private timerInterval: any;


  constructor(
    private readonly navSrv: NavController,
    private readonly authSrv: Auth,
    private readonly crudSrv: Crud,
    private readonly jsonPrv: Categories
  ) {
  }

  async ngOnInit() {

    this.setGreetin();

    const user = await this.authSrv.getCurrentUser();

    user != undefined ? this.firstName = user?.userName.split(' ')[0] : console.log('Sin usuario');

    if (user?.userUid) {
      const savedUser = await this.crudSrv.getByUid('users', user.userUid)

      if (savedUser) {
        this.department = savedUser[0].department;
      }
    }

    this.jsonPrv.getFormats().subscribe(formats => {
      this.formatsArray = formats

      this.finalFormats = this.formatsArray.filter(format => format.department.trim().toLowerCase() == this.department.trim().toLowerCase());
      console.log(this.finalFormats);

    })



    this.timerInterval = setInterval(() => {
      this.currentTime = new Date();
    }, 1000);

  }

  ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  goToCreateVisit(pdfName: string){
     this.navSrv.navigateRoot('create-visit', {
     state: { data: pdfName }
    });
  }

  setGreetin() {
    const horaActual = this.currentTime.getHours();

    if (horaActual >= 12 && horaActual < 19) {

      this.greeting = 'Buenas tardes';
    } else if (horaActual >= 19 || horaActual < 5) {

      this.greeting = 'Buenas noches';
    } else {

      this.greeting = 'Buenos días';
    }
  }


}
