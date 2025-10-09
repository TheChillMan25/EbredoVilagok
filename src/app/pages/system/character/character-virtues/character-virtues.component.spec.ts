import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterVirtuesComponent } from './character-virtues.component';

describe('CharacterVirtuesComponent', () => {
  let component: CharacterVirtuesComponent;
  let fixture: ComponentFixture<CharacterVirtuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharacterVirtuesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharacterVirtuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
