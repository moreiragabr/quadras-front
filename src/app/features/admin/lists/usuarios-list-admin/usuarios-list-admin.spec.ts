import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosListAdmin } from './usuarios-list-admin';

describe('UsuariosListAdmin', () => {
  let component: UsuariosListAdmin;
  let fixture: ComponentFixture<UsuariosListAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuariosListAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuariosListAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
