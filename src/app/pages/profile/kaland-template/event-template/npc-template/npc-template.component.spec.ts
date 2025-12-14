import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NpcTemplateComponent } from './npc-template.component';

describe('NpcTemplateComponent', () => {
  let component: NpcTemplateComponent;
  let fixture: ComponentFixture<NpcTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NpcTemplateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NpcTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
