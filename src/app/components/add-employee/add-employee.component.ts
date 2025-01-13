import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import { HeaderBarComponent } from "../header-bar/header-bar.component";
import { CustomSelectComponent } from "../custom-select/custom-select.component";
import { DatePickerComponent } from '../date-picker/date-picker.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss'],
  standalone: true,
  imports: [FormsModule, 
            HeaderBarComponent, 
            CustomSelectComponent, 
            DatePickerComponent, 
            MatNativeDateModule, 
            MatSnackBarModule
          ]
})
export class AddEmployeeComponent implements OnInit {
  id?: number;
  name = '';
  role = '';
  startDate: Date | null = null;
  endDate: Date | null = null;
  roles = ['Developer', 'Designer', 'Manager', 'Tester'];
  title = 'Add Employee Details';

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  async ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id = +idParam;
      const employee = (await this.employeeService.getAllEmployees()).find(
        emp => emp.id === this.id
      );
      if (employee) {
        this.name = employee.name;
        this.role = employee.role;
        this.startDate = employee.startDate;
        this.endDate = employee.endDate;
        this.title = 'Edit Employee Details';
      }

    }
  }

  async saveEmployee() {
    if (this.name && this.role && this.startDate) {
      if (this.id) { //Update
        const employees = await this.employeeService.getAllEmployees();
        const employeeIndex = employees.findIndex(emp => emp.id === this.id);
        if (employeeIndex > -1) {
          employees[employeeIndex] = {
            id: this.id,
            name: this.name,
            role: this.role,
            startDate: this.startDate,
            endDate: this.endDate
          };
        }
        this.employeeService.updateEmployee(employees[employeeIndex]).then(rec =>{
          this.router.navigate(['/']);
        });
      } else { //Add
        await this.employeeService.addEmployee({
          name: this.name,
          role: this.role,
          startDate: this.startDate,
          endDate: this.endDate
        }).then(rec =>{
          this.router.navigate(['/']);
        });
      }      
    } else {
      this.snackBar.open('Name, role and start date are required fields', undefined, {duration: 2000 });
    }
  }
  cancelEditEmployee() {
    this.router.navigate(['/']);
  }
}
