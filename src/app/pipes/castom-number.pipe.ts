import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'castomnumber',
  standalone: true
})
export class CastomNumberPipe implements PipeTransform {

  transform(val: number): string {
    if (val == null) return '';
    let srt = val + '';
    let parts = srt.split('.');
    if (+parts[0] == 0) {
      let index = 0;
      for (let i = 0; i < parts[1].length; i++) {
        if (+parts[1][i] != 0) {
          index = i;
          break;
        }
      }
      parts[1] = parts[1].slice(0, index + 4);
      return parts.join('.');
    } else {
      parts[1] = parts[1].slice(0,2);
      return parts.join('.');
    }
  }
}