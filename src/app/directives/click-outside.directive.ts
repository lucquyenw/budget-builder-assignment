import { Directive, ElementRef, HostListener, inject, output } from '@angular/core';
import { Direction } from '../enums/direction.enum';

@Directive({
    selector: '[appClickOutside]',
    standalone: true
})
export class ClickOutsideDirective {
    isClickedOutSide = output<boolean>();

    element = inject(ElementRef);

    @HostListener('document:click', ['$event'])
    onClick(event: Event) {
        const isClickedOutside = this._checkClickedOutsideCurrentElement(event);
        if (isClickedOutside) {
            this.isClickedOutSide.emit(isClickedOutside);
        }
    }

    _checkClickedOutsideCurrentElement(event: Event) {
        return !this.element.nativeElement.contains(event.target);
    }
}
