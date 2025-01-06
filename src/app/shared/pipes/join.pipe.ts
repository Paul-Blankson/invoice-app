import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'join',
  standalone: true,
})
export class JoinPipe implements PipeTransform {
  transform(value: (string | undefined)[], separator: string = ' '): string {
    if (!value) return '';
    return value
      .filter((item) => item && item.trim().length > 0)
      .join(separator);
  }
}
