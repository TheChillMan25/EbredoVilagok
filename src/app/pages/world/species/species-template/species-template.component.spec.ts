import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeciesTemplateComponent } from './species-template.component';

describe('SpeciesTemplateComponent', () => {
  let component: SpeciesTemplateComponent;
  let fixture: ComponentFixture<SpeciesTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpeciesTemplateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpeciesTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
