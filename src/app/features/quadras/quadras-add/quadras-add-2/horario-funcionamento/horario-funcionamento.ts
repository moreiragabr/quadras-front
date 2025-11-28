// operating-hours.component.ts
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-operating-hours',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './horario-funcionamento.html',
  styleUrl: './horario-funcionamento.scss'
})
export class OperatingHoursComponent implements OnInit {

  private fb = inject(FormBuilder);

  @Output() schedulesChanged = new EventEmitter<any[]>();

  // Lista estática para facilitar a criação do formulário
  readonly weekDays = [
    'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',
    'Quinta-feira', 'Sexta-feira', 'Sábado'
  ];

  form: FormGroup = this.fb.group({
    schedules: this.fb.array([])
  });

  get schedules() {
    return this.form.get('schedules') as FormArray;
  }

  ngOnInit(): void {
    // Inicializa o form com os 7 dias
    this.weekDays.forEach((day, index) => {
      const dayGroup = this.fb.group({
        dayOfWeek: [index],
        dayName: [day],
        isOpen: [true], // Padrão: Aberto
        openTime: ['08:00', Validators.required],
        closeTime: ['22:00', Validators.required]
      });

      this.schedules.push(dayGroup);
    });

    // 2. NOVO: Assina o valueChanges para sincronização em tempo real
    this.form.valueChanges.subscribe(formValue => {
      // formValue contém { schedules: [ dados do array ] }

      // O schedules.value já possui os dados limpos do FormArray
      this.emitSchedules(formValue.schedules);
    });

    // 3. Opcional: Emite o valor inicial (assim que o form é carregado)
    this.emitSchedules(this.schedules.value);
  }

  // Função auxiliar para emitir os dados
  emitSchedules(schedules: any[]): void {
    this.schedulesChanged.emit(schedules);
    console.log('Horários emitidos em tempo real.');
  }
}