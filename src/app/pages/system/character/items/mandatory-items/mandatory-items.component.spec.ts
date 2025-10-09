import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MandatoryItemsComponent } from './mandatory-items.component';

describe('MandatoryItemsComponent', () => {
  let component: MandatoryItemsComponent;
  let fixture: ComponentFixture<MandatoryItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MandatoryItemsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MandatoryItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
