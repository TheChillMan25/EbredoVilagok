import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KarakterTemplateComponent } from './karakter-template.component';

describe('KarakterTemplateComponent', () => {
  let component: KarakterTemplateComponent;
  let fixture: ComponentFixture<KarakterTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KarakterTemplateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KarakterTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
