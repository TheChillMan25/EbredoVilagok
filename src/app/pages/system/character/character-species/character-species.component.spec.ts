import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterSpeciesComponent } from './character-species.component';

describe('CharacterSpeciesComponent', () => {
  let component: CharacterSpeciesComponent;
  let fixture: ComponentFixture<CharacterSpeciesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharacterSpeciesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharacterSpeciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
