import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { Event } from 'src/app/shared/services/event/event';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.page.html',
  styleUrls: ['./notes.page.scss'],
  standalone: false,
})
export class NotesPage implements OnInit {
title!: FormControl;
description!: FormControl;
pdv!: FormControl;
start!: FormControl;
end!: FormControl;
department!: FormControl;

registerForm!: FormGroup;

minDate!: string;

  constructor(private readonly eventSrv: Event, private readonly navSrv: NavController) {
    this.initForm();
   }

  ngOnInit() {
    // const hoy = new Date();

    // this.minDate = hoy.setDate(hoy.getDate()-1);

    // console.log(this.minDate);
    const now = new Date().toISOString()

    const nowCol = formatDate(now, "yyyy-MM-ddTHH:mm:ss", 'es-CO', '-0500');
    this.minDate = nowCol;
  }

private initForm(){
const now = new Date().toISOString()

const nowCol = formatDate(now, "yyyy-MM-ddTHH:mm:ss", 'es-CO', '-0500');

console.log(now);


  this.title = new FormControl('', [Validators.required]);
  this.description = new FormControl('', [Validators.required]);
  this.pdv = new FormControl('', [Validators.required]);
  this.start  = new FormControl(nowCol, [Validators.required]);
  this.end  = new FormControl(nowCol, [Validators.required]);
  this.department = new FormControl('', [Validators.required])

  this.registerForm = new FormGroup({
    title: this.title,
    description: this.description,
    pdv: this.pdv,
    start: this.start,
    end: this.end,
    department: this.department
  });
}

public async doSchedule(){

  if (this.end.value <= this.start.value) {
    alert('El evento no puede terminar antes de la fecha inicial');
  }else{

    console.log(this.registerForm.value);

    await this.eventSrv.createEvent(this.registerForm.value).then((result) =>{
      this.navSrv.navigateRoot('home')
    }).catch((error) =>{
      console.log(error);
    })
  }




}

}

