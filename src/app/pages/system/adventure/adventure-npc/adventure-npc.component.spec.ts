import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdventureNpcComponent } from './adventure-npc.component';

describe('AdventureNpcComponent', () => {
  let component: AdventureNpcComponent;
  let fixture: ComponentFixture<AdventureNpcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdventureNpcComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdventureNpcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
