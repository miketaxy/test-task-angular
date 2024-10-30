import { TestBed } from "@angular/core/testing";
import { DateChangeService } from "./date-change.service";

describe('DateChangeService', () => {
    let service: DateChangeService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [DateChangeService]
        });
        service = TestBed.inject(DateChangeService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should set start date', () => {
        service.onStartDateChange({ target: { value: '2021-01-01' } } as unknown as Event);
        expect(service.startDate()).toEqual(new Date('2021-01-01'));
    });

    it('should set end date', () => {
        service.onEndDateChange({ target: { value: '2021-01-01' } } as unknown as Event);
        expect(service.endDate()).toEqual(new Date('2021-01-01'));
    });

    it('should set actual return start date', () => {
        service.onActualReturnStartDateChange({ target: { value: '2021-01-01' } } as unknown as Event);
        expect(service.actualReturnStartDate()).toEqual(new Date('2021-01-01'));
    });

    it('should set actual return end date', () => {
        service.onActualReturnEndDateChange({ target: { value: '2021-01-01' } } as unknown as Event);
        expect(service.actualReturnEndDate()).toEqual(new Date('2021-01-01'));
    });

    it('should set show overdue only', () => {
        service.onShowOverdueChange({ target: { checked: true } } as unknown as Event);
        expect(service.showOverdueOnly()).toBeTrue();
    });

    it('should return date filters', () => {
        service.startDate.set(new Date('2021-01-01'));
        service.endDate.set(new Date('2021-01-01'));
        service.actualReturnStartDate.set(new Date('2021-01-01'));
        service.actualReturnEndDate.set(new Date('2021-01-01'));
        service.showOverdueOnly.set(true);
        expect(service.getDate()).toEqual({
            startDate: service.startDate,
            endDate: service.endDate,
            actualReturnStartDate: service.actualReturnStartDate,
            actualReturnEndDate: service.actualReturnEndDate,
            showOverdueOnly: service.showOverdueOnly
        });
    });
});