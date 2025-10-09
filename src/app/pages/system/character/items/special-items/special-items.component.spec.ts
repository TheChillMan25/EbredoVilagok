import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialItemsComponent } from './special-items.component';

describe('SpecialItemsComponent', () => {
  let component: SpecialItemsComponent;
  let fixture: ComponentFixture<SpecialItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecialItemsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecialItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
