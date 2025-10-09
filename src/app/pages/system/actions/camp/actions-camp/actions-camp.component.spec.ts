import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionsCampComponent } from './actions-camp.component';

describe('ActionsCampComponent', () => {
  let component: ActionsCampComponent;
  let fixture: ComponentFixture<ActionsCampComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionsCampComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionsCampComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
