import { Directive, ElementRef, HostListener, inject } from '@angular/core';
import { Direction } from '../enums/direction.enum';

@Directive({
  selector: '[appHandleInput]',
  standalone: true
})
export class HandleInputDirective {

  element = inject(ElementRef);

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    const currentInput = this.element.nativeElement as HTMLElement;

    switch (event.key) {
      case 'ArrowDown':
        this._focusAdjacentCell(currentInput, Direction.down);
        break;
      case 'ArrowUp':
        this._focusAdjacentCell(currentInput, Direction.up);

        break;
      case 'ArrowRight':
      case 'Tab':
        event.preventDefault();
        this._focusAdjacentCell(currentInput, Direction.right);
        break;
      case 'ArrowLeft':
        this._focusAdjacentCell(currentInput, Direction.left);

        break;
      default:
        break;
    }
  }

  _focusAdjacentCell(currentInput: HTMLElement, direction: Direction) {
    const cell = currentInput.closest('td');
    const row = cell?.parentElement as HTMLTableRowElement;
    const table = row?.parentElement as HTMLTableElement;

    if (!table || !row || !cell) return;

    let targetCell: HTMLElement | null = null;

    switch (direction) {
      case Direction.down:
        targetCell = this.getSiblingCell(row.nextElementSibling, cell.cellIndex, direction);
        break;
      case Direction.up:
        targetCell = this.getSiblingCell(row.previousElementSibling, cell.cellIndex, direction);
        break;
      case Direction.right:
        targetCell = cell.nextElementSibling as HTMLElement;
        break;
      case Direction.left:
        targetCell = cell.previousElementSibling as HTMLElement;
        break;
    }

    if (targetCell) {
      const input = targetCell.querySelector('input') as HTMLElement;
      input?.focus();
    }
  }

  private getSiblingCell(row: Element | null, cellIndex: number, direction: Direction): HTMLElement | null {
    if (!row || !(row instanceof HTMLTableRowElement)) return null;

    if (row.cells[cellIndex]?.querySelector('input')) {
      return row.cells[cellIndex] as HTMLElement;
    }

    return direction === Direction.up ? this.getSiblingCell(row.previousElementSibling, cellIndex, direction) :
      this.getSiblingCell(row.nextElementSibling, cellIndex, direction)
  }


}
