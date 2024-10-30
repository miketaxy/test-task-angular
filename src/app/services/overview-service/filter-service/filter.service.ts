import { Injectable } from '@angular/core';
import { Loan } from '../../../models/loan.model';
import { Page } from '../../../models/page.model';
import { DateFilters } from '../../../models/date.model';

@Injectable({
  providedIn: 'root'
})
export class LoanFilterService {
  filterLoans(loans: Loan[], filters: {
    page: Page,
    dateFilters: DateFilters | null
  }): { filtered: Loan[], filteredLoansSize: number } {
    let filtered = loans;
    if (filters.dateFilters) {
      if (filters.dateFilters.startDate() || filters.dateFilters.endDate()) {
        filtered = filtered.filter(loan => {
          const issuanceDate = new Date(loan.issuance_date);
          const startDate = filters.dateFilters ? filters.dateFilters.startDate() : null;
          const endDate = filters.dateFilters ? filters.dateFilters.endDate() : null;
          const hasStartDate: boolean = startDate ? issuanceDate >= startDate : true;
          const hasEndDate: boolean = endDate ? issuanceDate <= endDate : true;
          return hasStartDate && hasEndDate;
        });
      }

      if (filters.dateFilters.actualReturnStartDate() || filters.dateFilters.actualReturnEndDate()) {
        filtered = filtered.filter(loan => {
          const actualReturnDate = new Date(loan.actual_return_date);
          const actualReturnStartDate = filters.dateFilters ? filters.dateFilters.actualReturnStartDate() : null;
          const actualReturnEndDate = filters.dateFilters ? filters.dateFilters.actualReturnEndDate() : null;
          const hasActualReturnStartDate: boolean = actualReturnStartDate ? actualReturnDate >= actualReturnStartDate : true;
          const hasActualReturnEndDate: boolean = actualReturnEndDate ? actualReturnDate <= actualReturnEndDate : true;
          return hasActualReturnStartDate && hasActualReturnEndDate;
        });
      }

      if (filters.dateFilters.showOverdueOnly()) {
        filtered = filtered.filter(loan => {
          const actualReturnDate = new Date(loan.actual_return_date);
          const returnDate = new Date(loan.return_date);

          return (actualReturnDate > returnDate ||
            (returnDate < new Date() && !loan.actual_return_date));
        });
      }
    }
    const filteredLoansSize = filtered.length;
    if (filters.page.page !== undefined && filters.page.pageSize !== undefined) {
      filtered = filtered.slice((filters.page.page - 1) * filters.page.pageSize, filters.page.page * filters.page.pageSize);
    }

    return { filtered, filteredLoansSize };
  }
}