import { Component, OnInit, EventEmitter,Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StopTrainingComponent } from './stop-training.component';
import { TrainingService } from '../training.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.css']
})
export class CurrentTrainingComponent implements OnInit {
@Output() trainingExit= new EventEmitter();
progress = 0;
timer:any;

constructor(private dilog:MatDialog  ,private trainingService: TrainingService,private router: Router){}


ngOnInit() {

this.startOrResumeTimer()

}

// startOrResumeTimer(){

//   this.timer = setInterval(()=>{
//   this.progress = this.progress + 1;
//   if(this.progress >= 100){
//     clearInterval(this.timer)
//   }
// },100);

// }

startOrResumeTimer() {
  const step = this.trainingService.getRunningExercise().duration / 100 * 1000;
  this.timer = setInterval(() => {
    this.progress = this.progress + 1;
    if (this.progress >= 100) {
      this.trainingService.completeExercise();
      clearInterval(this.timer);
    }
  }, step);
}


onStop() {
  clearInterval(this.timer);
  const dialogRef = this.dilog.open(StopTrainingComponent, {
    data: {
      progress: this.progress
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      // this.trainingExit.emit();
      this.trainingService.cancelExercise(this.progress);



    } else {
      this.startOrResumeTimer();
    }
  });
}



}


