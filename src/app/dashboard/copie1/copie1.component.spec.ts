import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Copie1Component } from './copie1.component';

describe('Copie1Component', () => {
  let component: Copie1Component;
  let fixture: ComponentFixture<Copie1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Copie1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Copie1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
