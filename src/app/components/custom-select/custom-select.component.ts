import { Component, ElementRef, Input, input, model } from '@angular/core';

@Component({
  selector: 'app-custom-select',
  standalone: true,
  imports: [],
  templateUrl: './custom-select.component.html',
  styleUrl: './custom-select.component.scss'
})
export class CustomSelectComponent {

  options = input<string[]>([]);
   
  selectedOption = model<string | null>(null);
  dropdownOpen = false;
  
  constructor(private elementRef: ElementRef) {}

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  selectOption(option: string): void {
    this.selectedOption.set(option);
    this.dropdownOpen = false;
  }

  ngAfterViewInit(): void {
    const customSelects = this.elementRef.nativeElement.getElementsByClassName('custom-select');
    const closeAllSelect = (elmnt: any) => {
      const items = document.getElementsByClassName('select-items');
      const selected = document.getElementsByClassName('select-selected');
      const arrNo: number[] = [];
      for (let i = 0; i < selected.length; i++) {
        if (elmnt !== selected[i]) {
          selected[i].classList.remove('select-arrow-active');
        } else {
          arrNo.push(i);
        }
      }
      for (let i = 0; i < items.length; i++) {
        if (!arrNo.includes(i)) {
          items[i].classList.add('select-hide');
        }
      }
    };

    

    document.addEventListener('click', () => closeAllSelect(null));
  }

}
