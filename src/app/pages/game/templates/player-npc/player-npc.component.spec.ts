import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerNpcComponent } from './player-npc.component';

describe('PlayerNpcComponent', () => {
  let component: PlayerNpcComponent;
  let fixture: ComponentFixture<PlayerNpcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerNpcComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerNpcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
