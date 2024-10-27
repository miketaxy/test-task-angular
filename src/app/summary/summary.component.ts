import { Component, OnInit, signal } from '@angular/core';
import { DataService } from '../data.service';
import { WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Loan } from '../loan.model';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css'],
  standalone: true,
  imports: [ CommonModule ],
  providers: [DataService]
  
})
export class SummaryComponent
 implements OnInit {
  loans: WritableSignal<Loan[]> = signal([]);
  totalLoans: WritableSignal<number> = signal(0);
  averageLoanAmount: WritableSignal<number> = signal(0);
  totalLoanAmount: WritableSignal<number> = signal(0);
  totalInterestAmount: WritableSignal<number> = signal(0);
  returnedLoansCount: WritableSignal<number> = signal(0);
  monthlyData: WritableSignal<{ [key: string]: { count: number; totalBody: number; totalPercent: number; returnedCount: number } }> = signal({});

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getData().subscribe((data: Loan[]) => {
      this.loans.set(data);
      this.calculateMetrics();
    });
  }

  calculateMetrics(): void {
    const loans = this.loans();
    this.totalLoans.set(loans.length);
    this.totalLoanAmount.set(loans.reduce((acc: any, loan: { body: any; }) => acc + loan.body, 0));
    this.totalInterestAmount.set(loans.reduce((acc: any, loan: { percent: any; }) => acc + loan.percent, 0));
    this.returnedLoansCount.set(loans.filter((loan: { actual_return_date: any; }) => loan.actual_return_date).length);
    this.averageLoanAmount.set(this.totalLoanAmount() / this.totalLoans() || 0);

    this.monthlyData.set(this.groupLoansByMonth(loans));
  }

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
