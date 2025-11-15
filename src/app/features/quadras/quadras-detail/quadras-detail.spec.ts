import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuadrasDetail } from './quadras-detail';

describe('QuadrasDetail', () => {
  let component: QuadrasDetail;
  let fixture: ComponentFixture<QuadrasDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuadrasDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuadrasDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
