import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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
departamento!: FormControl;

registerForm!: FormGroup;

  constructor() {
    this.initForm();
   }

  ngOnInit() {
  }

private initForm(){
  this.title = new FormControl('', [Validators.required]);
  this.description = new FormControl('', [Validators.required]);
  this.pdv = new FormControl('', [Validators.required]);
  this.start  = new FormControl('', [Validators.required]);
  this.end  = new FormControl('', [Validators.required]);

  this.registerForm = new FormGroup({
    title: this.title,
    description: this.description,
    pdv: this.pdv,
    start: this.start,
    end: this.end,
  });
}

public async doSchedule(){
  console.log(this.registerForm.value);

}

}

