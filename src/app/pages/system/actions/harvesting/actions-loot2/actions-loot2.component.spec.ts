import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionsLoot2Component } from './actions-loot2.component';

describe('ActionsLoot2Component', () => {
  let component: ActionsLoot2Component;
  let fixture: ComponentFixture<ActionsLoot2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionsLoot2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionsLoot2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
