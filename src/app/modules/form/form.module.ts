import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormComponent } from './components/form/form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormRoutingModule } from './form-routing.module';

@NgModule({
  declarations: [ FormComponent ],
  imports: [
    CommonModule, FormRoutingModule, ReactiveFormsModule
  ]
})
export class FormModule { }
