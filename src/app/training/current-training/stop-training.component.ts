import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector:'app-stop-training',
  template:`<h1 mat-dialog-title> Are you sure ?</h1>

<mat-dialog-content>
  <p>You already got {{passedData.progress}}</p>
</mat-dialog-content>

  <mat-dialog-actions class="dialog-actions" >

<button   mat-button [mat-dialog-close]="true" > Yes</button>
<button mat-button [mat-dialog-close]="false" > No</button>

</mat-dialog-actions>`,
styles: [`
.dialog-actions {
  display: flex;
  justify-content: center;
}
`]

})




export class StopTrainingComponent{

  constructor( private router: Router, private route: ActivatedRoute
   , @Inject(MAT_DIALOG_DATA) public passedData:any
  ){}


}
