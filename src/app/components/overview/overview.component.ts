import { Component, OnDestroy, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { DataService } from '../../services/data-service/data.service';
import { CommonModule } from '@angular/common';
import { Loan } from '../../models/loan.model';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LoanFilterService } from '../../services/overview-service/filter.service';

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
 * @property {WritableSignal<Date | null>} actualReturnStartDate - A signal holding the start date filter for actual return date.
 * @property {WritableSignal<Date | null>} actualReturnEndDate - A signal holding the end date filter for actual return date.
 * @property {WritableSignal<boolean>} showOverdueOnly - A signal indicating whether to show only overdue loans.
 * 
 * @constructor
 * @param {DataService} dataService - The data service used to fetch loan data.
 * 
 * @method ngOnInit - Initializes the component and fetches loan data.
 * @method onStartDateChange - Updates the start date filter and applies filters.
 * @method onEndDateChange - Updates the end date filter and applies filters.
 * @method onActualReturnStartDateChange - Updates the start date filter for actual return date and applies filters.
 * @method onActualReturnEndDateChange - Updates the end date filter for actual return date and applies filters.
 * @method onShowOverdueChange - Updates the overdue filter and applies filters.
 * @method applyFilters - Applies the selected filters to the list of loans.
 */
@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css'],
  providers: [DataService]
})
export class OverviewComponent implements OnInit, OnDestroy {
  loans: WritableSignal<Loan[]> = signal([]);
  filteredLoans: WritableSignal<Loan[]> = signal([]);
  startDate: WritableSignal<Date | null> = signal(null);
  endDate: WritableSignal<Date | null> = signal(null);
  actualReturnStartDate: WritableSignal<Date | null> = signal(null);
  actualReturnEndDate: WritableSignal<Date | null> = signal(null);
  showOverdueOnly: WritableSignal<boolean> = signal(false);
  page: number = 1;
  pageSize: number = 50;
  pagesArray: number[] = [];
  private subscriptions = new Subscription();

  constructor(private dataService: DataService, private loanFilterService: LoanFilterService) { }

  ngOnInit(): void {
    const subscription = this.dataService.getData().subscribe((data: Loan[]) => {
      this.loans.set(data);
      this.applyFilters();
    });
    this.subscriptions.add(subscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
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

  onActualReturnStartDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.actualReturnStartDate.set(input.value ? new Date(input.value) : null);
    this.applyFilters();
  }

  onActualReturnEndDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.actualReturnEndDate.set(input.value ? new Date(input.value) : null);
    this.applyFilters();
  }

  onShowOverdueChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.showOverdueOnly.set(input.checked);
    this.applyFilters();
  }

  applyFilters(): void {
    const loans = this.loans();
    const filtered = this.loanFilterService.filterLoans(loans, {
      startDate: this.startDate(),
      endDate: this.endDate(),
      actualReturnStartDate: this.actualReturnStartDate(),
      actualReturnEndDate: this.actualReturnEndDate(),
      showOverdueOnly: this.showOverdueOnly(),
      page: this.page,
      pageSize: this.pageSize
    });
    this.pagesArray = Array.from({ length: Math.ceil(this.loans().length / this.pageSize) }, (_, i) => i + 1);
    this.filteredLoans.set(filtered);
  }

  nextPage(): void {
    this.page++;
    this.applyFilters();
  }

  previousPage(): void {
    this.page--;
    this.applyFilters();
  }

  goToPage(page: number): void {
    this.page = page;
    this.applyFilters();
  }

  setPageSize(): void {
    this.page = 1;
    this.applyFilters();
  }
}