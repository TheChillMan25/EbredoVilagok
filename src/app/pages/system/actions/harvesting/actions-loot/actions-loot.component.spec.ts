import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionsLootComponent } from './actions-loot.component';

describe('ActionsLootComponent', () => {
  let component: ActionsLootComponent;
  let fixture: ComponentFixture<ActionsLootComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionsLootComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionsLootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
