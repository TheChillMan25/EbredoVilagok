import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterItemsComponent } from './character-items.component';

describe('CharacterItemsComponent', () => {
  let component: CharacterItemsComponent;
  let fixture: ComponentFixture<CharacterItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharacterItemsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharacterItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
