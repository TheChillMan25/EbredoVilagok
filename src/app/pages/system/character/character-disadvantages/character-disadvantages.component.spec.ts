import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterDisadvantagesComponent } from './character-disadvantages.component';

describe('CharacterDisadvantagesComponent', () => {
  let component: CharacterDisadvantagesComponent;
  let fixture: ComponentFixture<CharacterDisadvantagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharacterDisadvantagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharacterDisadvantagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
