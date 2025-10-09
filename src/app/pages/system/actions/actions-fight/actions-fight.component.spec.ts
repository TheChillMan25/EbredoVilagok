import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionsFightComponent } from './actions-fight.component';

describe('ActionsFightComponent', () => {
  let component: ActionsFightComponent;
  let fixture: ComponentFixture<ActionsFightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionsFightComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionsFightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
