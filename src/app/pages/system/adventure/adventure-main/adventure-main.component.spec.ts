import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdventureMainComponent } from './adventure-main.component';

describe('AdventureMainComponent', () => {
  let component: AdventureMainComponent;
  let fixture: ComponentFixture<AdventureMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdventureMainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdventureMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
