import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'displayZero',
    standalone: true
})
export class DisplayZeroPipe implements PipeTransform {
    transform(value: number | undefined): number {
        return !value || isNaN(value) ? 0 : value;
    }
}