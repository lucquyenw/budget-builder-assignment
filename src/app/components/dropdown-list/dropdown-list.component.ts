import { NgFor, NgIf } from '@angular/common';
import { DropdownOption } from './../../interfaces/dropdown.interface';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';

@Component({
  selector: 'app-dropdown-list',
  imports: [NgFor, NgIf, ClickOutsideDirective],
  templateUrl: './dropdown-list.component.html',
  styleUrl: './dropdown-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class DropdownListComponent {
  options = input<DropdownOption[]>([]);
  selectedValue = input<DropdownOption | null>(null);
  selectedValueChanged = output<DropdownOption>();

  showMenu = false;

  toggleDropdownList() {
    this.showMenu = !this.showMenu;
  }

  selectValue(seletedOption: DropdownOption) {
    this.selectedValueChanged.emit(seletedOption);
    this.toggleDropdownList();
  }
}
