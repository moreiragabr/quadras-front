import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimesList } from './times-list';

describe('TimesList', () => {
  let component: TimesList;
  let fixture: ComponentFixture<TimesList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimesList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimesList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
