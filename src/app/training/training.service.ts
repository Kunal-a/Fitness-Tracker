import { Subject, map } from 'rxjs';
import { Exercise } from './exercise.model';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
@Injectable()
export class TrainingService {
  exerciseChanged = new Subject<Exercise | null>();
  exercisesChanged = new Subject<Exercise[]>();
  finishedExercisesChanges = new Subject<Exercise[]>();
  private availableExercises: Exercise[] = [
    // { id: 'crunches', name: 'Crunches', duration: 30, calories: 8 },
    // { id: 'touch-toes', name: 'Touch Toes', duration: 180, calories: 15 },
    // { id: 'side-lunges', name: 'Side Lunges', duration: 120, calories: 18 },
    // { id: 'burpees', name: 'Burpees', duration: 60, calories: 8 }
  ];
  private runningExercise!: Exercise;
  private exercises: Exercise[] = [];
  private finishedExercises: Exercise[] = [];
  private fbSubs: Subscription[] = [];

  constructor(private db: AngularFirestore ,private authService : AuthService ) {}

  // fetchAvailableExercises() {
  //   this.db
  //     .collection('availableExercises')
  //     .snapshotChanges()
  //     .map(docArray => {
  //       return docArray.map(doc => {
  //         return {
  //           id: doc.payload.doc.id,
  //           name: doc.payload.doc.data()['name'],
  //           duration: doc.payload.doc.data()['duration'],
  //           calories: doc.payload.doc.data()['calories']
  //         };
  //       });
  //     })
  //     .subscribe((exercises: Exercise[]) => {
  //       this.availableExercises = exercises;
  //       this.exerciseChanged.next([...this.availableExercises]);
  //     });
  // }

  fetchAvailableExercises() {
    this.fbSubs.push(this.db
      .collection('availableExercises')
      .snapshotChanges()
      .pipe(
        map((docArray: any[]) => {
          // Specify types for the parameters
          return docArray.map((doc) => {
            return {
              id: doc.payload.doc.id,
              name: doc.payload.doc.data()['name'],
              duration: doc.payload.doc.data()['duration'],
              calories: doc.payload.doc.data()['calories'],
            };
          });
        })
      )
      .subscribe((exercises: Exercise[]) => {
        this.availableExercises = exercises;
        this.exercisesChanged.next([...this.availableExercises]); // Emit exercises array
      },



    ));
  }

  startExercise(name: string) {
    //  this.db.doc('availableExercises/' + name).update({lastSelected: new Date()})


    const foundExercise = this.availableExercises.find(
      (ex) => ex.name === name
    );
    if (foundExercise) {
      this.runningExercise = foundExercise;
      this.exerciseChanged.next({ ...this.runningExercise });
      console.log(name);
    } else {
      // Handle the case where the exercise with the given ID is not found
      console.error('Exercise with ID', name, 'not found.');
    }
  }

  // startExercise(selectedId: string) {   this.runningExercise = this.availableExercises.find(ex => ex.id === selectedId)!;
  //   this.exerciseChanged.next({ ...this.runningExercise });
  //     }

  completeExercise() {
    this.addDataToDatabase({
      ...this.runningExercise,
      date: new Date(),
      state: 'completed',
      userId: this.authService.getUserId()!
    });
    this.runningExercise;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress: number , calories:number) {
    this.addDataToDatabase({
      ...this.runningExercise,
      duration: this.runningExercise.duration * (progress / 100),
      calories: this.runningExercise.duration * (calories / 100),
      date: new Date(),
      state: 'cancelled',
      userId: this.authService.getUserId()!
    });
    this.runningExercise;
    this.exerciseChanged.next(null);
  }

  getRunningExercise() {
    return { ...this.runningExercise };
  }

  // fetchCompletedOrCancelledExercises() {
  //   this.db
  //     .collection('finishedExercises')
  //     .valueChanges()
  //     .subscribe((exercises: Exercise[]) => {
  //       this.finishedExercisesChanges.next(exercises);
  //     });
  // }


  // fetchCompletedOrCancelledExercises() {
  //   const userId = this.authService.getUserId();
  //   this.fbSubs.push(this.db
  //     .collection('finishedExercises')
  //     .valueChanges()
  //     .pipe(
  //       map((exercises: any[]) => {
  //         return exercises.map(exercise => {
  //           return {
  //             id: exercise.id,
  //             name: exercise.name,
  //             duration: exercise.duration,
  //             calories: exercise.calories,
  //             date: exercise.date.toDate(), // assuming Firestore Timestamp
  //             state: exercise.state
  //           };
  //         });
  //       })
  //     )
  //     .subscribe((exercises: Exercise[]) => {
  //       this.finishedExercisesChanges.next(exercises);
  //     }));
  // }



  fetchCompletedOrCancelledExercises() {
    const userId = this.authService.getUserId(); // Ensure you get the current user's UID
    if (!userId) {
      // Handle the case where userId is null (e.g., user is not authenticated)
      return;
    }

    this.fbSubs.push(
      this.db.collection('finishedExercises', ref => ref.where('userId', '==', userId))
        .valueChanges()
        .pipe(
          map((exercises: any[]) => exercises.map(exercise => ({
            ...exercise,
            date: exercise.date.toDate() // Convert Firestore Timestamp to JavaScript Date
          } as Exercise)))
        )
        .subscribe((exercises: Exercise[]) => {
          this.finishedExercisesChanges.next(exercises);
        })
    );
  }

  cancelSubscriptions(){
    this.fbSubs.forEach(sub => sub.unsubscribe() );
  }



  //add data to database
  private addDataToDatabase(exercise: Exercise) {
    this.db.collection('finishedExercises').add(exercise);
  }
}

