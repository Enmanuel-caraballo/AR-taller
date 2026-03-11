import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Task } from '../../shared/services/task/task';
import { NavController } from '@ionic/angular';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.page.html',
  styleUrls: ['./add-task.page.scss'],
  standalone: false
})
export class AddTaskPage implements OnInit {

  title!: FormControl;
  limitDate!: FormControl;
  description!: FormControl;
  link!: FormControl;
  important!: FormControl;

  FormTask!: FormGroup;

  minDate!: string;

  constructor(private readonly taskSrv: Task, private readonly navSrv: NavController) {
    this.initForm()
  }

  ngOnInit() {
    const now = new Date().toISOString()

    const nowCol = formatDate(now, "yyyy-MM-ddTHH:mm:ss", 'es-CO', '-0500');
    this.minDate = nowCol;
  }

  private initForm(){
    const now = new Date().toISOString()

    const nowCol = formatDate(now, "yyyy-MM-ddTHH:mm:ss", 'es-CO', '-0500');

    this.title = new FormControl('', [Validators.required]);
    this.limitDate = new FormControl(nowCol, [Validators.required]);
    this.description = new FormControl('', [Validators.required]);
    this.link = new FormControl();
    this.important = new FormControl();

    this.FormTask = new FormGroup({
      title: this.title,
      limitDate: this.limitDate,
      description: this.description,
      link: this.link,
      important: this.important
    })
  }

  public async addTask(){

    if (this.limitDate.value< this.minDate) {
      alert('La fecha de finalización no puede ser menor a la actual')
    }else{

      await this.taskSrv.createTask(this.FormTask.value).then((resolve) =>{
       this.navSrv.navigateRoot('home');
      }).catch((error) =>{
       console.log(error);
      })

    }

  }

}
