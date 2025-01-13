import { Component, OnInit, signal, Signal, WritableSignal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { HeaderBarComponent } from "../header-bar/header-bar.component";
import { DatePipe } from '@angular/common';
import { HammerModule } from '@angular/platform-browser';
import { EmployeeCardComponent } from "../employee-card/employee-card.component";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

interface Employee {
  id: number;
  name: string;
  role: string;
  startDate: Date;
  endDate: Date | null;
}

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
  standalone: true,
  imports: [HeaderBarComponent, EmployeeCardComponent, MatSnackBarModule]
})
export class EmployeeListComponent implements OnInit {
  employees: WritableSignal<Employee[]> = signal([]);
  currentEmployees = signal<Employee[]>([]);
  previousEmployees = signal<Employee[]>([]);

  constructor(private employeeService: EmployeeService, private router: Router, private snackBar: MatSnackBar) {}

  async ngOnInit() {
    this.loadEmployeeList();    
  }
  async loadEmployeeList() {
    const recs = await this.employeeService.getAllEmployees();
    this.employees.set(recs);
    this.filterEmployees();
  }

  private filterEmployees() {
    const now = new Date();
    this.currentEmployees.set(
      this.employees().filter(
        (employee) =>
          !employee.endDate || employee.endDate >= now
      )
    );
    this.previousEmployees.set(
      this.employees().filter(
        (employee) => employee.endDate && new Date(employee.endDate) < now
      )
    );
  }

  navigateToAddEmployee() {
    this.router.navigate(['/add-employee']);
  }

  navigateToEditEmployee(id: number) {
    this.router.navigate(['/edit-employee', id]);
  }

  async removeEmployee(employeeId: any) {
    const updatedEmployees = this.employees().filter((emp) => emp.id !== employeeId);
    this.employees.set(updatedEmployees);
    this.filterEmployees(); //Rebuild current and previous employee lists
    
    let snackBarRef = this.snackBar.open('Employee data has been removed', 'Undo', {duration: 5000 });
    snackBarRef.onAction().subscribe(() => {
      this.snackBar.open('Service not implemented!', undefined, {duration: 2000 });
    });
  }
  
}