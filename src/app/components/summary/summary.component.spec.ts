import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SummaryComponent } from './summary.component';
import { Loan } from '../../models/loan.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DataService } from '../../services/data-service/data.service';

describe('SummaryComponent', () => {
  let component: SummaryComponent;
  let fixture: ComponentFixture<SummaryComponent>;
  const mockLoans: Loan[] = [
    {
      "user": "pageantrylamentable",
      "issuance_date": "2020-01-11",
      "return_date": "2020-01-25",
      "actual_return_date": "2021-04-23",
      "body": 4500,
      "percent": 32535.0
    },
    {
      "user": "ninnybudweiser",
      "issuance_date": "2020-01-12",
      "return_date": "2020-01-26",
      "actual_return_date": "2020-08-30",
      "body": 4500,
      "percent": 16537.5
    },
    {
      "user": "shoelanguid",
      "issuance_date": "2020-01-20",
      "return_date": "2020-02-03",
      "actual_return_date": "2020-11-23",
      "body": 1500,
      "percent": 7245.0
    }
  ];


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummaryComponent, HttpClientTestingModule],
      providers: [DataService]
    }).compileComponents();

    fixture = TestBed.createComponent(SummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should create the component', () => {
    expect(component).toBeTruthy();
  })


  it('should calculate metrics', () => {
    component.loans.set(mockLoans);
    component.calculateMetrics();
    expect(component.totalLoans()).toEqual(3);
    expect(component.totalLoanAmount()).toEqual(10500);
    expect(component.totalInterestAmount()).toEqual(56317.5);
    expect(component.returnedLoansCount()).toEqual(3);
    expect(component.averageLoanAmount()).toEqual(3500);
    expect(component.monthlyData()).toEqual({
      '2020-01': {
        count: 3,
        totalBody: 10500,
        totalPercent: 56317.5,
        returnedCount: 3
      }
    });
  });

  
  it('should group loans by month', () => {
    const groupedLoans = component.groupLoansByMonth(mockLoans);
    expect(groupedLoans).toEqual({
      '2020-01': {
        count: 3,
        totalBody: 10500,
        totalPercent: 56317.5,
        returnedCount: 3
      }
    });
  });
});
