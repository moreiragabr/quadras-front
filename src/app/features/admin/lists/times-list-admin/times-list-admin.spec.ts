import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimesListAdmin } from './times-list-admin';

describe('TimesListAdmin', () => {
  let component: TimesListAdmin;
  let fixture: ComponentFixture<TimesListAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimesListAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimesListAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
