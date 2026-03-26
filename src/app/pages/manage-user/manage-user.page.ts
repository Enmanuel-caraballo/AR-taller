import { Component, OnInit } from '@angular/core';
import { Crud } from 'src/app/core/providers/crudFirebase/crud';
import { IUserCreate } from 'src/app/interfaces/user.interface';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.page.html',
  styleUrls: ['./manage-user.page.scss'],
  standalone: false
})
export class ManageUserPage implements OnInit {

  savedUser!: IUserCreate;

  doc: string  = '';

  constructor(private readonly crudSrv: Crud) { }

  ngOnInit() {

  }

  async serchByDoc(doc:string){

    try {
      if (doc.length > 4) {
        const u = await this.crudSrv.getByDoc('users', doc);

        u.length > 0 ? this.savedUser = u[0] : console.log('error al recuperar usuario');
        console.log(u);
      }

    } catch (error) {
      console.log(error);


    }


  }

  deleteUser(uid: string) {
    console.log('Ejecutando lógica para eliminar al usuario con UID:', uid);
    // Lógica para eliminar de Firebase
  }

  promoteUser(uid: string) {
    console.log('Ejecutando lógica para promover al usuario con UID:', uid);
    // Lógica para actualizar el rol/departamento en Firebase
  }

  disableUser(uid: string) {
    console.log('Ejecutando lógica para inhabilitar al usuario con UID:', uid);
    // Lógica para cambiar estado activo/inactivo en Firebase
  }

}
