import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MLFormComponent } from './mlform.component';

describe('MLFormComponent', () => {
  let component: MLFormComponent;
  let fixture: ComponentFixture<MLFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MLFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MLFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
