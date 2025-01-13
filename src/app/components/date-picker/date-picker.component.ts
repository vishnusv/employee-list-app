import { Component, input, model } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDatepicker, MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule} from '@angular/material/input';
import { MatIconModule} from '@angular/material/icon'
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { DatePickerDialogComponent } from './date-picker-dialog/date-picker-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [MatDialogModule,
            MatFormFieldModule,
            MatInputModule,
            MatButtonModule,
            MatIconModule,
            ReactiveFormsModule, 
            DatePipe
          ],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.scss'
})
export class DatePickerComponent {
  selectedDate = model<Date | null>();
  min = input<Date | null>();
  type = input<"STARTDATE" | "ENDDATE">("STARTDATE");

  constructor(private dialog: MatDialog, private dateAdapter: DateAdapter<Date>) {}

  openDatePickerDialog(event:MouseEvent): void {
    const dialogRef = this.dialog.open(DatePickerDialogComponent, {
      width: '400px',
      //minHeight: '530px',
      data: { selectedDate: this.selectedDate(), min: this.min(), type: this.type() },
      autoFocus: true,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result: Date | null) => {      
        this.selectedDate.set(result);
    });
  }
}
