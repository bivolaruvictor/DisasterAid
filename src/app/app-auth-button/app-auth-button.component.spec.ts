import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppAuthButtonComponent } from './app-auth-button.component';

describe('AppAuthButtonComponent', () => {
  let component: AppAuthButtonComponent;
  let fixture: ComponentFixture<AppAuthButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppAuthButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppAuthButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
