import { Component, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { DataService } from '../../services/data-service/data.service';
import { CommonModule } from '@angular/common';
import { Loan } from '../../models/loan.model';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LoanFilterService } from '../../services/overview-service/filter-service/filter.service';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { PaginationService } from '../../services/overview-service/pagination-service/pagination.service';
import { DateChangeService } from '../../services/overview-service/date-change-service/date-change.service';

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
  imports: [CommonModule, FormsModule, NgbPaginationModule],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css'],
  providers: [DataService]
})
export class OverviewComponent implements OnInit, OnDestroy {
  loans: WritableSignal<Loan[]> = signal([]);
  filteredLoans: WritableSignal<Loan[]> = signal([]);


  private subscriptions = new Subscription();

  constructor(private dataService: DataService
    , private loanFilterService: LoanFilterService
    , public paginationService: PaginationService // public to be able to access it from the template
    , private dateChangeService: DateChangeService
  ) { }

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
    this.dateChangeService.onStartDateChange(event);
    this.applyFilters();
  }

  onEndDateChange(event: Event): void {
    this.dateChangeService.onEndDateChange(event);
    this.applyFilters();
  }

  onActualReturnStartDateChange(event: Event): void {
    this.dateChangeService.onActualReturnStartDateChange(event);
    this.applyFilters();
  }

  onActualReturnEndDateChange(event: Event): void {
    this.dateChangeService.onActualReturnEndDateChange(event);
    this.applyFilters();
  }

  onShowOverdueChange(event: Event): void {
    this.dateChangeService.onShowOverdueChange(event);
    this.applyFilters();
  }
  
  applyFilters(): void {
    const loans = this.loans();
    const {filtered, filteredLoansSize} = this.loanFilterService.filterLoans(loans, {
      page: this.paginationService.getPagination(),
      dateFilters: this.dateChangeService.getDate()
    });
    this.paginationService.filteredLoansSize = filteredLoansSize;
    this.filteredLoans.set(filtered);
  }

  nextPage(): void {
    this.paginationService.nextPage();
    this.applyFilters();
  }

  previousPage(): void {
    this.paginationService.previousPage();
    this.applyFilters();
  }

  goToPage(page: number): void {
    this.paginationService.goToPage(page);
    this.applyFilters();
  }

  setPageSize(): void {
    this.paginationService.setPageSize();
    this.applyFilters();
  }
}