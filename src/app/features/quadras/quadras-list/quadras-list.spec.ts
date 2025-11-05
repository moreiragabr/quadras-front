import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuadrasList } from './quadras-list';

describe('QuadrasList', () => {
  let component: QuadrasList;
  let fixture: ComponentFixture<QuadrasList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuadrasList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuadrasList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
