import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandsComponent } from './lands.component';

describe('LandsComponent', () => {
  let component: LandsComponent;
  let fixture: ComponentFixture<LandsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
