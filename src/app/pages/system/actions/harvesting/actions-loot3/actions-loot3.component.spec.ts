import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionsLoot3Component } from './actions-loot3.component';

describe('ActionsLoot3Component', () => {
  let component: ActionsLoot3Component;
  let fixture: ComponentFixture<ActionsLoot3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionsLoot3Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionsLoot3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
