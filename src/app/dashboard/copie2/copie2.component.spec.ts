import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Copie2Component } from './copie2.component';

describe('Copie2Component', () => {
  let component: Copie2Component;
  let fixture: ComponentFixture<Copie2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Copie2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Copie2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
