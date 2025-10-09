import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdventureEventComponent } from './adventure-event.component';

describe('AdventureEventComponent', () => {
  let component: AdventureEventComponent;
  let fixture: ComponentFixture<AdventureEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdventureEventComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdventureEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
