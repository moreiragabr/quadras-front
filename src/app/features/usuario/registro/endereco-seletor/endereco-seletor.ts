import { Component, EventEmitter, inject, numberAttribute, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs/operators';
import { CepService } from '../../../../core/service/cepService/cep-service';
import { Endereco } from '../../../../core/models/endereco';

@Component({
  selector: 'app-address-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './address-input.html',
  styleUrl: './address-input.scss'
})
export class AddressInputComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private cepService = inject(CepService);
  private sub: Subscription = new Subscription();

  numeroCasa?: string;

  // Emite o endereço formatado para o pai (QuadrasAdd)
  @Output() addressChanged = new EventEmitter<any>();

  form: FormGroup = this.fb.group({
    cep: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
    rua: [''],
    bairro: [''],
    cidade: [''],
    estado: [''],
    numeroCasa: ['', Validators.required]
  });

  ngOnInit(): void {
    this.setupCepListener();
  }

  private setupCepListener() {
    const cepControl = this.form.get('cep');
    if (cepControl) {
      this.sub = cepControl.valueChanges.pipe(
        debounceTime(300),
        // Remove formatação visual se houver (ex: 12345-678 -> 12345678)
        distinctUntilChanged(),
        // Só prossegue se tiver 8 dígitos
        filter(value => value && value.replace(/\D/g, '').length === 8),
        // Cancela requisição anterior se o usuário digitar de novo (SwitchMap)
        switchMap(cep => this.cepService.findAdressByCep(cep))
      ).subscribe({
        next: (data: Endereco) => {
          if (!data.erro) {
            this.fillAddress(data);
          } else {
            this.clearAddress();
            alert('CEP não encontrado!');
          }
        },
        error: (err) => {
          console.error('Erro ao buscar CEP', err);
          this.clearAddress();
        }
      });
    }
    this.sub.add(this.form.valueChanges.pipe(
      // Evita emitir se apenas os campos automáticos mudaram (opcional, mas bom)
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr))
    ).subscribe(() => {
      // Chama a função de emissão sempre que *qualquer* campo do form mudar
      // (incluindo o numeroCasa digitado manualmente)
      this.emitAddress();
    }));
  }

  private fillAddress(data: Endereco) {
    const addressData = {
      rua: data.logradouro,
      bairro: data.bairro,
      cidade: data.localidade,
      estado: data.uf
    };
    this.form.patchValue(addressData);

    // Chamamos a emissão após o preenchimento automático
    this.emitAddress();
  }

  private emitAddress() {
    // Certifique-se de que o formulário está no estado que você deseja emitir
    const fullAddress = this.form.getRawValue();

    // Emite para o componente Pai (QuadrasAdd)
    this.addressChanged.emit({
      cep: fullAddress.cep,
      rua: fullAddress.rua,
      bairro: fullAddress.bairro,
      cidade: fullAddress.cidade,
      estado: fullAddress.estado,
      numeroCasa: fullAddress.numeroCasa // INCLUÍDO
    });

    console.log(fullAddress);
  }

  private clearAddress() {
    this.form.patchValue({
      rua: '',
      bairro: '',
      cidade: '',
      estado: ''
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}