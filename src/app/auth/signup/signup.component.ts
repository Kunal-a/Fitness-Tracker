import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup,NgForm,Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  minDate: Date;
  myForm!:FormGroup;

 constructor(private fb:FormBuilder , private authService:AuthService     ){
  const today = new Date();
  this.minDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
 }

ngOnInit(){
  this.myForm = this.fb.group({
    email: ['', [Validators.required,Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$') ]],
    password: ['', [Validators.required, Validators.pattern('^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*\\d)[a-zA-Z\\d!@#$%^&*(),.?":{}|<>]{3,}$') ]],
    date: ['', [Validators.required]],
    checkbox: [false, Validators.requiredTrue]
  })





}

onSubmit(){
  this.authService.registerUser({
    email:this.myForm.value.email,
    password:this.myForm.value.password
  });
  console.log('Form submitted with:', this.myForm.value);
}







}
