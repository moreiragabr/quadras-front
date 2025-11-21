import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuadrasAdd2 } from './quadras-add-2';

describe('QuadrasAdd2', () => {
  let component: QuadrasAdd2;
  let fixture: ComponentFixture<QuadrasAdd2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuadrasAdd2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuadrasAdd2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
