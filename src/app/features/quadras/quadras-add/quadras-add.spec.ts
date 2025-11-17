import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuadrasAdd } from './quadras-add';

describe('QuadrasAdd', () => {
  let component: QuadrasAdd;
  let fixture: ComponentFixture<QuadrasAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuadrasAdd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuadrasAdd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
