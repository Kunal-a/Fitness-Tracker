
import { AfterViewInit, Component,OnDestroy,OnInit , ViewChild ,} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-past-training',
  templateUrl: './past-training.component.html',
  styleUrls: ['./past-training.component.css']
})

export class PastTrainingComponent implements OnInit , AfterViewInit, OnDestroy  {

  displayedColumns=['date','name','duration', 'calories','state'];

dataSource = new MatTableDataSource<Exercise>();
private exChangedSubscription!: Subscription




  @ViewChild(MatSort)
  sort!: MatSort;

constructor(
  private trainingService: TrainingService
){}
  ngOnDestroy() {
    this.exChangedSubscription.unsubscribe()
  }



ngOnInit(){
  this.exChangedSubscription = this.trainingService.finishedExercisesChanges.subscribe((exercises: Exercise[])=>{
    this.dataSource.data =exercises;
  })
this.trainingService.fetchCompletedOrCancelledExercises();
}

ngAfterViewInit() {
  this.dataSource.sort = this.sort;

}



}
