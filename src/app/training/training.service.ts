

import { Subject } from 'rxjs';


import { Exercise } from './exercise.model';

export class TrainingService {
  exerciseChanged = new Subject<Exercise |null >();
  private availableExercises: Exercise[] = [
    { id: 'crunches', name: 'Crunches', duration: 30, calories: 8 },
    { id: 'touch-toes', name: 'Touch Toes', duration: 180, calories: 15 },
    { id: 'side-lunges', name: 'Side Lunges', duration: 120, calories: 18 },
    { id: 'burpees', name: 'Burpees', duration: 60, calories: 8 }
  ];
  private runningExercise!: Exercise;
  private exercises: Exercise[] = [];

  getAvailableExercises() {
    return this.availableExercises.slice();
  }
  startExercise(name: string) {
    const foundExercise = this.availableExercises.find(ex => ex.name === name);
    if (foundExercise) {
      this.runningExercise = foundExercise;
      this.exerciseChanged.next({ ...this.runningExercise });
      console.log(name)
    } else {
      // Handle the case where the exercise with the given ID is not found
      console.error("Exercise with ID", name, "not found.");
    }
  }


  // startExercise(selectedId: string) {   this.runningExercise = this.availableExercises.find(ex => ex.id === selectedId)!;
  //   this.exerciseChanged.next({ ...this.runningExercise });
  //     }

  completeExercise() {
    this.exercises.push({
      ...this.runningExercise,
      date: new Date(),
      state: 'completed'
    });
    this.runningExercise;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress: number) {
    this.exercises.push({
      ...this.runningExercise,
      duration: this.runningExercise.duration * (progress / 100),
      calories: this.runningExercise.duration * (progress / 100),
      date: new Date(),
      state: 'cancelled'
    });
    this.runningExercise;
    this.exerciseChanged.next(null);
  }

  getRunningExercise() {
    return { ...this.runningExercise };
  }

  getCompletedOrCancelledExercises(){
    return this.exercises.slice();
  }



}
