import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionsMainComponent } from './actions-main.component';

describe('ActionsMainComponent', () => {
  let component: ActionsMainComponent;
  let fixture: ComponentFixture<ActionsMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionsMainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionsMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
