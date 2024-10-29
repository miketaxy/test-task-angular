import { Injectable } from '@angular/core';
import { Loan } from '../../models/loan.model';

@Injectable({
  providedIn: 'root'
})
export class LoanFilterService {
  filterLoans(loans: Loan[], filters: {
    startDate?: Date | null,
    endDate?: Date | null,
    actualReturnStartDate?: Date | null,
    actualReturnEndDate?: Date | null,
    showOverdueOnly?: boolean,
    page?: number,
    pageSize?: number
  }): Loan[] {
    let filtered = loans;

    if (filters.startDate || filters.endDate) {
      filtered = filtered.filter(loan => {
        const issuanceDate = new Date(loan.issuance_date);
        const startDate = filters.startDate;
        const endDate = filters.endDate;
        const hasStartDate: boolean = startDate ? issuanceDate >= startDate : true;
        const hasEndDate: boolean = endDate ? issuanceDate <= endDate : true;
        return hasStartDate && hasEndDate;
      });
    }

    if (filters.actualReturnStartDate || filters.actualReturnEndDate) {
      filtered = filtered.filter(loan => {
        const actualReturnDate = new Date(loan.actual_return_date);
        const actualReturnStartDate = filters.actualReturnStartDate;
        const actualReturnEndDate = filters.actualReturnEndDate;
        const hasActualReturnStartDate: boolean = actualReturnStartDate ? actualReturnDate >= actualReturnStartDate : true;
        const hasActualReturnEndDate: boolean = actualReturnEndDate ? actualReturnDate <= actualReturnEndDate : true;
        return hasActualReturnStartDate && hasActualReturnEndDate;
      });
    }

    if (filters.showOverdueOnly) {
      filtered = filtered.filter(loan => {
        const actualReturnDate = new Date(loan.actual_return_date);
        const returnDate = new Date(loan.return_date);

        return (actualReturnDate > returnDate ||
          (returnDate < new Date() && !loan.actual_return_date));
      });
    }

    if (filters.page !== undefined && filters.pageSize !== undefined) {
      filtered = filtered.slice(((filters.page - 1) * filters.pageSize), filters.page * filters.pageSize);
    }

    return filtered;
  }
}