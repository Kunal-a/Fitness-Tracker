

// import { AuthData } from './auth.data.model';
// import { User } from './user.model';
// import { Subject } from 'rxjs';
// import { Injectable } from '@angular/core';
// import { Router } from '@angular/router';
// import { AngularFireAuth } from '@angular/fire/compat/auth';
// import { TrainingService } from '../training/training.service';
// import { MatSnackBar } from '@angular/material/snack-bar';

// @Injectable()
// export class AuthService {
//   authChange = new Subject<boolean>();
//   // private user: User | null = null;
//   private isAuthenticated = false;

//   constructor(private router: Router, private afauth: AngularFireAuth , private trainingService: TrainingService,
//     private snackbar:MatSnackBar
//   ) {}


//  initAuthListener(){
//   this.afauth.authState.subscribe( user =>{
//     if (user){
//       this.isAuthenticated = true;
//     this.authChange.next(true);
//     this.router.navigate(['/training']);

//     }
//     else{
//       this.authChange.next(false);
//       this.trainingService.cancelSubscriptions();
//       this.isAuthenticated = false;
//       this.router.navigate(['/login']);
//     }
//   });
//  }



//   registerUser(authData: AuthData) {
//     this.afauth
//       .createUserWithEmailAndPassword(authData.email, authData.password)
//       .then((result) => {

//       })
//       .catch((error) => {
//       this.snackbar.open(error.message,'null' ,{
//         duration:3000
//       });
//       });
//   }

//   login(authData: AuthData) {
//     this.afauth
//       .signInWithEmailAndPassword(authData.email, authData.password)
//       .then((result) => {

//       })
//       .catch((error) => {
//         this.snackbar.open(error.message ,'ok', {
//           duration:3000
//         });
//       });

//   }

//   logout() {

// this.afauth.signOut();

//   }



//   isAuth() {
//     return this.isAuthenticated;
//   }


// }
import { AuthData } from './auth.data.model';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';

@Injectable()
export class AuthService {
  authChange = new Subject<boolean>();
  private isAuthenticated = false;
  private userId: string | null = null; // Store the current user's UID

  constructor(
    private router: Router,
    private afauth: AngularFireAuth,
    private snackbar: MatSnackBar
  ) {}

  initAuthListener() {
    this.afauth.authState.subscribe(user => {
      if (user) {
        this.isAuthenticated = true;
        this.userId = user.uid; // Save the user's UID when they log in
        this.authChange.next(true);
        this.router.navigate(['/training']);
      } else {
        this.isAuthenticated = false;
        this.userId = null; // Clear the user's UID when they log out
        this.authChange.next(false);
        this.router.navigate(['/login']);
      }
    });
  }

  registerUser(authData: AuthData) {
    this.afauth.createUserWithEmailAndPassword(authData.email, authData.password)
      .then(result => {})
      .catch(error => {
        this.snackbar.open(error.message, 'null', { duration: 3000 });
      });
  }

  login(authData: AuthData) {
    this.afauth.signInWithEmailAndPassword(authData.email, authData.password)
      .then(result => {})
      .catch(error => {
        this.snackbar.open(error.message, 'ok', { duration: 3000 });
      });
  }

  logout() {
    this.afauth.signOut();
  }

  isAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId; // Provide a method to get the current user's UID
  }
}
