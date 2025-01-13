import { Component, Input, Output, EventEmitter, HostBinding } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { DatePipe } from '@angular/common';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { EmployeeService } from '../../services/employee.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-card',
  standalone: true,
  templateUrl: 'employee-card.component.html',  
  styleUrl: 'employee-card.component.scss',
  animations: [
    trigger('swipeAnimation', [
      state(
        'default',
        style({
          transform: 'translateX(0)',          
        })
      ),
      state(
        'swiped',
        style({
          transform: 'translateX(-50px)',          
        })
      ),
      transition('default => swiped', [animate('200ms ease-out')]),
      transition('swiped => default', [animate('200ms ease-in')]),
    ]),
  ],
  imports: [DatePipe, MatIconModule]
})
export class EmployeeCardComponent {
  @Input() employee: any;
  @Output() deleted :EventEmitter<number> = new EventEmitter<number>();
  @HostBinding('@swipeAnimation') swipeState: 'default' | 'swiped' = 'default';
  dragged = false;
  constructor(private employeeService: EmployeeService, private router: Router) {    
  }

  onSwiteLeft(event: any) {
    const deltaX = event.deltaX;
    if (deltaX < -25) { //handle half swipes
      this.swipeState = 'swiped';      
    } else if (deltaX > 0) {
      this.swipeState = 'default';      
    }
  }
  onSwiteRight(event: any) {
    const deltaX = event.deltaX;
    //On desktop/laptop screens, swipe using mouse 
    //fires click event also. This flag is used to block it.
    this.dragged = true;
    setTimeout(() =>{
      this.dragged = false;
    }, 1000)
    if (deltaX < 25) {
      this.swipeState = 'swiped';      
    } else if (deltaX > 25) {
      this.swipeState = 'default';      
    }
  }

  navigateToEditEmployee(id: number) {
    //If the click even came from a swipe event, ignore
    if(this.swipeState == 'default' && !this.dragged)
      this.router.navigate(['/edit-employee', id]);
  }

  deleteEmployee(employeeId: any) {
    this.employeeService.deleteEmployee(employeeId).then(rec=> {
      this.deleted.emit(employeeId);
    });
  }
}
