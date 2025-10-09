import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionsCamp2Component } from './actions-camp2.component';

describe('ActionsCamp2Component', () => {
  let component: ActionsCamp2Component;
  let fixture: ComponentFixture<ActionsCamp2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionsCamp2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionsCamp2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
