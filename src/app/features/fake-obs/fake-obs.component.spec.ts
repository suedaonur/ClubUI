import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FakeObsComponent } from './fake-obs.component';

describe('FakeObsComponent', () => {
  let component: FakeObsComponent;
  let fixture: ComponentFixture<FakeObsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FakeObsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FakeObsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
