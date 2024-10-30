import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { DataService } from '../../services/data-service/data.service';
import { WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Loan } from '../../models/loan.model';
import { Subscription } from 'rxjs';
import { LoanSummary } from '../../models/loan-summary.model';

/**
 * Component responsible for displaying a summary of loan data.
 * 
 * @component
 * @selector app-summary
 * @templateUrl ./summary.component.html
 * @styleUrls ./summary.component.css
 * @standalone true
 * @imports CommonModule
 * @providers DataService
 */
@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css'],
  providers: [DataService]
})
export class SummaryComponent implements OnInit, OnDestroy {
  /**
   * Signal holding the list of loans.
   */
  loans: WritableSignal<Loan[]> = signal([]);

  /**
   * Signal holding the total number of loans.
   */
  totalLoans: WritableSignal<number> = signal(0);

  /**
   * Signal holding the average loan amount.
   */
  averageLoanAmount: WritableSignal<number> = signal(0);

  /**
   * Signal holding the total loan amount.
   */
  totalLoanAmount: WritableSignal<number> = signal(0);

  /**
   * Signal holding the total interest amount.
   */
  totalInterestAmount: WritableSignal<number> = signal(0);

  /**
   * Signal holding the count of returned loans.
   */
  returnedLoansCount: WritableSignal<number> = signal(0);

  /**
   * Signal holding the monthly data of loans.
   */
  monthlyData: WritableSignal<{ [key: string]: LoanSummary }> = signal({});

  private subscriptions = new Subscription();
  /**
   * Constructor for SummaryComponent.
   * 
   * @param dataService - Service for fetching loan data.
   */
  constructor(private dataService: DataService) {}
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /**
   * Lifecycle hook that is called after data-bound properties of a directive are initialized.
   * Fetches loan data and calculates metrics.
   */
  ngOnInit(): void {
    const subscription = this.dataService.getData().subscribe((data: Loan[]) => {
      this.loans.set(data);
      this.calculateMetrics();
    });
    this.subscriptions.add(subscription);
  }

  /**
   * Calculates various metrics based on the loan data.
   */
  /*
  * I don't see any reason to make service for those methods. They are not reusable and they are not used in other components.
  */
  calculateMetrics(): void {
    const loans = this.loans();
    this.totalLoans.set(loans.length);
    this.totalLoanAmount.set(loans.reduce((acc: number, loan: { body: number; }) => acc + loan.body, 0));
    this.totalInterestAmount.set(loans.reduce((acc: number, loan: { percent: number; }) => acc + loan.percent, 0));
    this.returnedLoansCount.set(loans.filter((loan: { actual_return_date: string; }) => loan.actual_return_date).length);
    this.averageLoanAmount.set(this.totalLoanAmount() / this.totalLoans() || 0);

    this.monthlyData.set(this.groupLoansByMonth(loans));
  }  

  /**
   * Groups loans by their issuance month.
   * 
   * @param loans - Array of loans to be grouped.
   * @returns An object where keys are months and values are loan statistics for that month.
   */
  /*
  * I don't see any reason to make service for those methods. They are not reusable and they are not used in other components.
  */
  groupLoansByMonth(loans: Loan[]): { [key: string]: { count: number; totalBody: number; totalPercent: number; returnedCount: number } } {
    return loans.reduce((acc, loan) => {
      const month = loan.issuance_date.substring(0, 7); 
      if (!acc[month]) {
        acc[month] = { count: 0, totalBody: 0, totalPercent: 0, returnedCount: 0 };
      }
      acc[month].count++;
      acc[month].totalBody += loan.body;
      acc[month].totalPercent += loan.percent;
      if (loan.actual_return_date) {
        acc[month].returnedCount++;
      }
      return acc;
    }, {} as { [key: string]: { count: number; totalBody: number; totalPercent: number; returnedCount: number } });
  }
}

