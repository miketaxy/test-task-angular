import { TestBed } from '@angular/core/testing';
import { LoanFilterService } from './filter.service';
import { Loan } from '../../models/loan.model';

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
    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(LoanFilterService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should filter mockLoans by startDate and endDate', () => {
        const filters = { startDate: new Date('2020-01-11'), endDate: new Date('2020-01-20') };
        const result = service.filterLoans(mockLoans, filters);
        expect(result.length).toBe(3);
        expect(result[0].issuance_date).toBe('2020-01-11');
        expect(result[1].issuance_date).toBe('2020-01-12');
        expect(result[2].issuance_date).toBe('2020-01-20');
    });

    it('should filter mockLoans by actualReturnStartDate and actualReturnEndDate', () => {
        const filters = { actualReturnStartDate: new Date('2020-08-01'), actualReturnEndDate: new Date('2021-04-30') };
        const result = service.filterLoans(mockLoans, filters);
        expect(result.length).toBe(3);
    });

    it('should filter mockLoans by showOverdueOnly', () => {
        const filters = { showOverdueOnly: true };
        const result = service.filterLoans(mockLoans, filters);
        expect(result.length).toBe(3);
    });
});