import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerTemplateComponent } from './player-template.component';

describe('PlayerTemplateComponent', () => {
  let component: PlayerTemplateComponent;
  let fixture: ComponentFixture<PlayerTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerTemplateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
