import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Campo, CampoSelecionado } from '../../../../core/models/campo';

@Component({
  selector: 'app-item-selector',
  templateUrl: './item-seletor.html',
  styleUrls: ['./item-seletor.scss'],
  standalone: true,
  imports: [FormsModule]
})
export class ItemSelectorComponent {
  @Output() itensChange = new EventEmitter<CampoSelecionado[]>();

  itensDisponiveis: Campo[] = [
    { identificador: 1, nome: 'Society', },
    { identificador: 2, nome: 'Futsal', },
    { identificador: 3, nome: 'Vôlei', },
    { identificador: 4, nome: 'Tênis' },
    { identificador: 5, nome: 'Handebol', },
    { identificador: 6, nome: 'Areia', },
    { identificador: 7, nome: 'Beachtênis', },
    { identificador: 8, nome: 'Futebol' },
    { identificador: 9, nome: 'Basquete'}
  ];

  itensSelecionados: CampoSelecionado[] = [];
  itemSelecionado: string = '';

  itemJaAdicionado(itemId: number): boolean {
    return this.itensSelecionados.some(item => item.id === itemId);
  }

  adicionarItem(): void {
    if (!this.itemSelecionado) return;

    const itemExistente = this.itensSelecionados.find(campo => campo.nome === this.itemSelecionado);

    if (itemExistente) {
      this.aumentarQuantidade(this.itensSelecionados.indexOf(itemExistente));
    } else {
      const itemOriginal = this.itensDisponiveis.find(item => item.nome === this.itemSelecionado);
      if (itemOriginal) {
        const novoItem: CampoSelecionado = {
          ...itemOriginal,
          quantidade: 1
        };
        this.itensSelecionados.push(novoItem);
        this.emitirMudancas();
      }
    }

    this.itemSelecionado = '';
  }

  aumentarQuantidade(index: number): void {
    this.itensSelecionados[index].quantidade++;
    this.emitirMudancas();
  }

  diminuirQuantidade(index: number): void {
    if (this.itensSelecionados[index].quantidade > 1) {
      this.itensSelecionados[index].quantidade--;
      this.emitirMudancas();
    }
  }

  removerItem(index: number): void {
    this.itensSelecionados.splice(index, 1);
    this.emitirMudancas();
  }

  getTotalItens(): number {
    return this.itensSelecionados.reduce((total, item) => total + item.quantidade, 0);
  }

  private emitirMudancas(): void {
    this.itensChange.emit([...this.itensSelecionados]);
  }
}