import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { OverviewComponent } from './overview.component';
import { DataService } from '../../services/data-service/data.service';
import { Loan } from '../../models/loan.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { LoanFilterService } from '../../services/overview-service/filter-service/filter.service';
import { PaginationService } from '../../services/overview-service/pagination-service/pagination.service';
import { DateChangeService } from '../../services/overview-service/date-change-service/date-change.service';
describe('OverviewComponent', () => {
    let component: OverviewComponent;
    let fixture: ComponentFixture<OverviewComponent>;
    let dataService: DataService;
    let loanFilterService: LoanFilterService;
    let paginationService: PaginationService;
    let dateChangeService: DateChangeService;

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

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [OverviewComponent, HttpClientTestingModule],
            providers: [
                DataService,
                LoanFilterService,
                PaginationService,
                DateChangeService
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(OverviewComponent);
        component = fixture.componentInstance;
        dataService = TestBed.inject(DataService);
        loanFilterService = TestBed.inject(LoanFilterService);
        paginationService = TestBed.inject(PaginationService);
        dateChangeService = TestBed.inject(DateChangeService);

        spyOn(dataService, 'getData').and.returnValue(of(mockLoans));
        spyOn(loanFilterService, 'filterLoans').and.returnValue({ filtered: mockLoans, filteredLoansSize: mockLoans.length });
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should unsubscribe on ngOnDestroy', () => {
        spyOn(component['subscriptions'], 'unsubscribe');
        component.ngOnDestroy();
        expect(component['subscriptions'].unsubscribe).toHaveBeenCalled();
    });

    it('should call applyFilters on start date change', () => {
        spyOn(component, 'applyFilters');
        spyOn(dateChangeService, 'onStartDateChange');
        const event = new Event('change');
        component.onStartDateChange(event);
        expect(dateChangeService.onStartDateChange).toHaveBeenCalledWith(event);
        expect(component.applyFilters).toHaveBeenCalled();
    });

    it('should call applyFilters on end date change', () => {
        spyOn(component, 'applyFilters');
        spyOn(dateChangeService, 'onEndDateChange');
        const event = new Event('change');
        component.onEndDateChange(event);
        expect(dateChangeService.onEndDateChange).toHaveBeenCalledWith(event);
        expect(component.applyFilters).toHaveBeenCalled();
    });

    it('should call applyFilters on actual return start date change', () => {
        spyOn(component, 'applyFilters');
        spyOn(dateChangeService, 'onActualReturnStartDateChange');
        const event = new Event('change');
        component.onActualReturnStartDateChange(event);
        expect(dateChangeService.onActualReturnStartDateChange).toHaveBeenCalledWith(event);
        expect(component.applyFilters).toHaveBeenCalled();
    });

    it('should call applyFilters on actual return end date change', () => {
        spyOn(component, 'applyFilters');
        spyOn(dateChangeService, 'onActualReturnEndDateChange');
        const event = new Event('change');
        component.onActualReturnEndDateChange(event);
        expect(dateChangeService.onActualReturnEndDateChange).toHaveBeenCalledWith(event);
        expect(component.applyFilters).toHaveBeenCalled();
    });

    it('should call applyFilters on show overdue change', () => {
        spyOn(component, 'applyFilters');
        spyOn(dateChangeService, 'onShowOverdueChange');
        const event = new Event('change');
        component.onShowOverdueChange(event);
        expect(dateChangeService.onShowOverdueChange).toHaveBeenCalledWith(event);
        expect(component.applyFilters).toHaveBeenCalled();
    });

    it('should call applyFilters on next page', () => {
        spyOn(component, 'applyFilters');
        spyOn(paginationService, 'nextPage');
        component.nextPage();
        expect(paginationService.nextPage).toHaveBeenCalled();
        expect(component.applyFilters).toHaveBeenCalled();
    });

    it('should call applyFilters on previous page', () => {
        spyOn(component, 'applyFilters');
        spyOn(paginationService, 'previousPage');
        component.previousPage();
        expect(paginationService.previousPage).toHaveBeenCalled();
        expect(component.applyFilters).toHaveBeenCalled();
    });

    it('should call applyFilters on go to page', () => {
        spyOn(component, 'applyFilters');
        spyOn(paginationService, 'goToPage');
        const page = 2;
        component.goToPage(page);
        expect(paginationService.goToPage).toHaveBeenCalledWith(page);
        expect(component.applyFilters).toHaveBeenCalled();
    });

    it('should call applyFilters on set page size', () => {
        spyOn(component, 'applyFilters');
        spyOn(paginationService, 'setPageSize');
        component.setPageSize();
        expect(paginationService.setPageSize).toHaveBeenCalled();
        expect(component.applyFilters).toHaveBeenCalled();
    });
});