import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent  implements OnInit {

  myForm!:FormGroup;




constructor(private fb:FormBuilder , private authService:AuthService){}

ngOnInit() {
  this.myForm = this.fb.group({
    email: ['', [Validators.required,Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$') ]],
    password: ['', [Validators.required, Validators.pattern('^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*\\d)[a-zA-Z\\d!@#$%^&*(),.?":{}|<>]{3,}$') ]],

  })


}
onSubmit(){
 this.authService.login({
  email:this.myForm.value.email,
  password:this.myForm.value.password
 })

  console.log('Form submitted with:', this.myForm.value);
}





}
