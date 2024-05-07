import {ComponentFixture, TestBed} from '@angular/core/testing';
import {AboutComponent} from './about.component';
import {DialogModule, DialogRef} from '@angular/cdk/dialog';

describe('AboutComponent', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;

  const mockDialogRef = {
    close: jasmine.createSpy('close'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutComponent, DialogModule],
      providers: [
        {
          provide: DialogRef,
          useValue: mockDialogRef,
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call close', () => {
    component.close();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });
});
