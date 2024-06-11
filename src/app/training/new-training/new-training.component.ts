// import { Component,OnInit,EventEmitter, Output  } from '@angular/core';
// import { TrainingService } from '../training.service';
// import { Exercise } from '../exercise.model';
// import { NgForm } from '@angular/forms';

// @Component({
//   selector: 'app-new-training',
//   templateUrl: './new-training.component.html',
//   styleUrls: ['./new-training.component.css']
// })
// export class NewTrainingComponent implements OnInit {
// @Output() trainingStart = new EventEmitter<void>();
// exercises:Exercise[]=[];

// constructor (  private trainingService: TrainingService    ){}

// ngOnInit(){
//   this.exercises = this.trainingService.getAvailableExercises();

// }

//   onStartTraining( form: NgForm){
// this.trainingService.startExercise(form.value.exercise)
//   }

// }
import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  OnDestroy,
} from '@angular/core';
import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';
import { NgForm } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, Subscription } from 'rxjs';
@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css'],
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  @Output() trainingStart = new EventEmitter<void>();
  exercises!: Exercise[];
  exerciseSubscription!: Subscription;

  constructor(private trainingService: TrainingService) {}

  ngOnInit() {
    this.exerciseSubscription = this.trainingService.exercisesChanged.subscribe(
      (exercises: Exercise[]) => {
        this.exercises = exercises;
      }
    );
    this.trainingService.fetchAvailableExercises();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.selectedExercise);
  }

  ngOnDestroy(): void {
    this.exerciseSubscription.unsubscribe();
  }
}
