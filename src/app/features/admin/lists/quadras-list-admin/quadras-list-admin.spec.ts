import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuadrasListAdmin } from './quadras-list-admin';

describe('QuadrasListAdmin', () => {
  let component: QuadrasListAdmin;
  let fixture: ComponentFixture<QuadrasListAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuadrasListAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuadrasListAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
