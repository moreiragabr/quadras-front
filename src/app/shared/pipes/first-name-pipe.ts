import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstName',
  standalone: true
})
export class FirstNamePipe implements PipeTransform {

  /**
   * Transforma uma string de nome completo para retornar apenas o primeiro nome.
   * Ex: "João da Silva" -> "João"
   * Ex: "Maria" -> "Maria"
   */
  transform(fullName: string | null | undefined): string | null {
    if (!fullName) {
      return null;
    }

    // 1. Limpa espaços em branco e divide por espaços
    const nameParts = fullName.trim().split(' ');

    // 2. Verifica se há pelo menos uma parte no nome
    if (nameParts.length > 0 && nameParts[0].length > 0) {
      const firstName = nameParts[0];
      
      // 3. Retorna o primeiro nome com a primeira letra maiúscula (para consistência)
      // Ex: "joao" ou "JOAO" -> "Joao"
      return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
    }

    return null;
  }
}