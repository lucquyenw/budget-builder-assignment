import { ParentCategory } from './../../interfaces/budget-table.interface';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { BudgetTableSerivice } from '../../services/budget-table.service';
import { JsonPipe, NgFor, NgIf } from '@angular/common';
import { DropdownListComponent } from '../dropdown-list/dropdown-list.component';
import { FormsModule } from '@angular/forms';
import { DisplayZeroPipe, } from '../../pipes/display-zero.pipe';
import { HandleInputDirective } from '../../directives/handle-input.directive';
import { ContextMenuComponent } from '../context-menu/context-menu.component';
import { ContextMenu } from '../../interfaces/context-menu.interface';

const components = [DropdownListComponent, ContextMenuComponent];
const pipes = [DisplayZeroPipe]
const directives = [HandleInputDirective]

@Component({
  selector: 'app-budget-table',
  imports: [NgFor, FormsModule, NgIf, pipes, components, directives],
  templateUrl: './budget-table.component.html',
  styleUrl: './budget-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BudgetTableComponent implements AfterViewInit {

  @ViewChild('table') table!: ElementRef;

  budgetTableService = inject(BudgetTableSerivice);
  contextMenu = signal<ContextMenu>({
    x: 0,
    y: 0,
    isShow: false,
    isParent: false
  })

  ngAfterViewInit(): void {
    this._focusOnFirstInput();
  }


  trackByFn(index: number, obj: any) {
    return index;
  }

  onRightClick({ event, value, parentIndex, rootIndex, isParent, childIndex }:
    { event: MouseEvent, value?: number, parentIndex: number, rootIndex: number, isParent?: boolean, childIndex?: number }) {
    event.preventDefault();

    this.contextMenu.set({
      x: event.pageX,
      y: event.pageY,
      value,
      isShow: true,
      parentIndex,
      rootIndex,
      isParent: isParent || false,
      childIndex
    });


  }

  applyToAll(contextMenu: ContextMenu) {
    if (contextMenu.isParent) {
      this.budgetTableService.applyToParentCategories(contextMenu.rootIndex, contextMenu.parentIndex, contextMenu.value);
    } else {
      this.budgetTableService.applyToChildCategories(contextMenu.rootIndex, contextMenu.parentIndex, contextMenu.childIndex, contextMenu.value);
      this._resetContextMenu();
    }
    this._resetContextMenu();

  }

  deleteRow(contextMenu: ContextMenu) {
    if (contextMenu.isParent) {
      this.budgetTableService.deleteParentCategories(contextMenu.rootIndex, contextMenu.parentIndex);
    } else {
      this.budgetTableService.deleteChildCategories(contextMenu.rootIndex, contextMenu.parentIndex, contextMenu.childIndex);
    }

    this._resetContextMenu();

  }

  _resetContextMenu() {
    this.contextMenu.set({
      x: 0,
      y: 0,
      isShow: false,
      isParent: false,

    })
  }

  _focusOnFirstInput() {
    const firstInput = this.table.nativeElement.querySelector('input') as HTMLInputElement;
    firstInput.focus();
  }

}
