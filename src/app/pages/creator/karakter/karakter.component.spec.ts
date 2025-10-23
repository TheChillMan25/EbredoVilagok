import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KarakterComponent } from './karakter.component';

describe('KarakterComponent', () => {
  let component: KarakterComponent;
  let fixture: ComponentFixture<KarakterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KarakterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KarakterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
