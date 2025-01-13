import { Component, Inject, signal } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CalendarHeaderComponent } from './calendar-header/calendar-header.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-date-picker-dialog',
  standalone: true,
  imports: [ MatButtonModule, MatDatepickerModule, ReactiveFormsModule, DatePipe ],
  templateUrl: './date-picker-dialog.component.html',
  styleUrl: './date-picker-dialog.component.scss'
})
export class DatePickerDialogComponent {
  dateControl = new FormControl<Date | null>(this.data.selectedDate);
  readonly calendarHeader = CalendarHeaderComponent;
  min = signal<Date | null>(this.data.min);
  type= signal<"STARTDATE" | "ENDDATE">(this.data.type);
  constructor(
    public dialogRef: MatDialogRef<DatePickerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { selectedDate: Date | null, min: Date | null, type: "STARTDATE" | "ENDDATE" }
  ) {
    
  }

  clearSelection(): void {
    this.dateControl.setValue(null);
  }

  selectToday(): void {
    this.dateControl.setValue(new Date());
  }

  selectNextMonday(): void {
    const today = new Date();
    const day = today.getDay();
    if(day == 1) { //If today is monday, select next monday
      this.selectAfterOneWeek();
      return;
    }    
    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + ((8 - day) % 7));
    this.dateControl.setValue(nextMonday);
  }

  selectNextTuesday(): void {
    const today = new Date();
    const day = today.getDay();
    if(day == 2) { //If today is tuesday, select next monday
      this.selectAfterOneWeek();
      return;
    }
    const nextTuesday = new Date(today);
    if(today.getDay()==2) {
      nextTuesday.setDate(today.getDate() + 1);
    }
    nextTuesday.setDate(today.getDate() + ((9 - day) % 7));
    this.dateControl.setValue(nextTuesday);
  }

  selectAfterOneWeek(): void {
    const today = new Date();
    const afterOneWeek = new Date(today);
    afterOneWeek.setDate(today.getDate() + 7);
    this.dateControl.setValue(afterOneWeek);
  }

  save(): void {
    this.dialogRef.close(this.dateControl.value);
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
