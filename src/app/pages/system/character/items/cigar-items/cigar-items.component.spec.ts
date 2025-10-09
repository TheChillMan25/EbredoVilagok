import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CigarItemsComponent } from './cigar-items.component';

describe('CigarItemsComponent', () => {
  let component: CigarItemsComponent;
  let fixture: ComponentFixture<CigarItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CigarItemsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CigarItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
