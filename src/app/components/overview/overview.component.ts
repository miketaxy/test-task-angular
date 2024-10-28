import { Component, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { DataService } from '../../services/data.service';
import { CommonModule } from '@angular/common';
import { Loan } from '../../models/loan.model';

/**
 * OverviewComponent is responsible for displaying and filtering a list of loans.
 * It allows filtering by start date, end date, and overdue status.
 * 
 * @component
 * @selector app-overview
 * @standalone true
 * @imports CommonModule
 * @templateUrl ./overview.component.html
 * @styleUrls ./overview.component.css
 * @providers DataService
 * 
 * @property {WritableSignal<Loan[]>} loans - A signal holding the list of loans.
 * @property {WritableSignal<Loan[]>} filteredLoans - A signal holding the filtered list of loans.
 * @property {WritableSignal<Date | null>} startDate - A signal holding the start date filter.
 * @property {WritableSignal<Date | null>} endDate - A signal holding the end date filter.
 * @property {WritableSignal<boolean>} showOverdueOnly - A signal indicating whether to show only overdue loans.
 * 
 * @constructor
 * @param {DataService} dataService - The data service used to fetch loan data.
 * 
 * @method ngOnInit - Initializes the component and fetches loan data.
 * @method onStartDateChange - Updates the start date filter and applies filters.
 * @method onEndDateChange - Updates the end date filter and applies filters.
 * @method onShowOverdueChange - Updates the overdue filter and applies filters.
 * @method applyFilters - Applies the selected filters to the list of loans.
 */
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
      this.applyFilters();
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

    if (this.startDate() || this.endDate()) {
      filtered = filtered.filter(loan => {
        const issuanceDate = new Date(loan.issuance_date);
        const startDate = this.startDate();
        const endDate = this.endDate();
        const hasStartDate: boolean = startDate ? issuanceDate >= startDate : true;
        const hasEndDate: boolean = endDate ? issuanceDate <= endDate : true;
        return hasStartDate && hasEndDate;
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