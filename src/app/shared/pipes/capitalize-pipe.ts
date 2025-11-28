import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalize'
})
export class CapitalizePipe implements PipeTransform {
  
  transform(value: string | undefined | null, allWords: boolean = false): string {
    // Verifica se o valor é null, undefined ou vazio
    if (!value) return '';

    // Agora o TypeScript sabe que value é string
    if (allWords) {
      return value.toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    } else {
      return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    }
  }

}
