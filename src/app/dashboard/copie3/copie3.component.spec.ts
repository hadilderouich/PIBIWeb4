import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Copie3Component } from './copie3.component';

describe('Copie3Component', () => {
  let component: Copie3Component;
  let fixture: ComponentFixture<Copie3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Copie3Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Copie3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
