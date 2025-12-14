import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KalandTemplateComponent } from './kaland-template.component';

describe('KalandTemplateComponent', () => {
  let component: KalandTemplateComponent;
  let fixture: ComponentFixture<KalandTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KalandTemplateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KalandTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
