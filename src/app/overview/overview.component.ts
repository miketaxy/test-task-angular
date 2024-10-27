import { Component, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { DataService } from '../data.service';
import { CommonModule } from '@angular/common';
import { Loan } from '../loan.model';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css'],
  providers: [DataService]
})
export class OverviewComponent implements OnInit {
  loans: WritableSignal<Loan[]> = signal([]);
  filteredLoans: WritableSignal<Loan[]> = signal([]); 
  startDate: WritableSignal<Date | null> = signal(null); 
  endDate: WritableSignal<Date | null> = signal(null); 
  showOverdueOnly: WritableSignal<boolean> = signal(false);

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getData().subscribe((data: Loan[]) => {
      this.loans.set(data);
      this.applyFilters(); // Применяем фильтры после загрузки данных
    });
  }

  onStartDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.startDate.set(input.value ? new Date(input.value) : null);
    this.applyFilters();
  }

  onEndDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.endDate.set(input.value ? new Date(input.value) : null);
    this.applyFilters();
  }

  onShowOverdueChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.showOverdueOnly.set(input.checked);
    this.applyFilters();
  }

  applyFilters(): void {
    const loans = this.loans();
    let filtered = loans;

    if (this.startDate() && this.endDate()) {
      filtered = filtered.filter(loan => {
        const issuanceDate = new Date(loan.issuance_date);
        const startDate = this.startDate();
        const endDate = this.endDate();
        return startDate && endDate && issuanceDate >= startDate && issuanceDate <= endDate;
      });
    }

    if (this.showOverdueOnly()) {
      filtered = filtered.filter(loan => {
        const actualReturnDate = new Date(loan.actual_return_date);
        const returnDate = new Date(loan.return_date);
        return (actualReturnDate > returnDate || 
                (returnDate < new Date() && !loan.actual_return_date));
      });
    }

    this.filteredLoans.set(filtered); 
  }
}