import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.page.html',
  styleUrls: ['./add-task.page.scss'],
  standalone: false
})
export class AddTaskPage implements OnInit {

  title!: FormControl;
  limitTime!: FormControl;
  description!: FormControl;
  link!: FormControl;
  important!: FormControl;

  FormTask!: FormGroup;

  constructor() {
    this.initForm()
  }

  ngOnInit() {
  }

  private initForm(){
    this.title = new FormControl('', [Validators.required]);
    this.limitTime = new FormControl('', [Validators.required]);
    this.description = new FormControl('', [Validators.required]);
    this.link = new FormControl();
    this.important = new FormControl();

    this.FormTask = new FormGroup({
      title: this.title,
      limitTime: this.limitTime,
      description: this.description,
      link: this.link,
      important: this.important
    })
  }

}
