import { TestBed } from '@angular/core/testing';
import { LoanFilterService } from './filter.service';
import { Loan } from '../../../models/loan.model';
import { DateFilters } from '../../../models/date.model';
import { signal } from '@angular/core';
import { Page } from '../../../models/page.model';

describe('LoanFilterService', () => {
    let service: LoanFilterService;
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
    const mockPage: Page = { page: 0, pageSize: 10, filteredLoansSize: 0 };

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(LoanFilterService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should filter mockLoans by startDate and endDate', () => {
        const filters: DateFilters = {
            startDate: signal(new Date('2020-01-11')),
            endDate: signal(new Date('2020-01-20')),
            actualReturnStartDate: signal(null),
            actualReturnEndDate: signal(null),
            showOverdueOnly: signal(false)
        };

        const {filteredLoansSize} = service.filterLoans(mockLoans, { page: mockPage, dateFilters: filters });
        expect(filteredLoansSize).toBe(3);
    });

    it('should filter mockLoans by actualReturnStartDate and actualReturnEndDate', () => {
        const filters: DateFilters = {
            startDate: signal(null),
            endDate: signal(null),
            actualReturnStartDate: signal(new Date('2020-08-01')),
            actualReturnEndDate: signal(new Date('2021-04-30')),
            showOverdueOnly: signal(false)
        };

        const {filteredLoansSize} = service.filterLoans(mockLoans, { page: mockPage, dateFilters: filters });
        expect(filteredLoansSize).toBe(3);
    });

    it('should filter mockLoans by showOverdueOnly', () => {
        const filters: DateFilters = {
            startDate: signal(null),
            endDate: signal(null),
            actualReturnStartDate: signal(null),
            actualReturnEndDate: signal(null),
            showOverdueOnly: signal(true)
        };

        const {filteredLoansSize} = service.filterLoans(mockLoans, { page: mockPage, dateFilters: filters });
        expect(filteredLoansSize).toBe(3);
    });
});