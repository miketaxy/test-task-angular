import { TestBed } from "@angular/core/testing";
import { PaginationService } from "./pagination.service";

describe('PaginationService', () => {
    let service: PaginationService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [PaginationService]
        });
        service = TestBed.inject(PaginationService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should set page to 2', () => {
        service.nextPage();
        expect(service.page).toBe(2);
    });

    it('should set page to 1', () => {
        service.nextPage();
        service.previousPage();
        expect(service.page).toBe(1);
    });

    it('should set page to 3', () => {
        service.goToPage(3);
        expect(service.page).toBe(3);
    });

    it('should set page to 1', () => {
        service.goToPage(3);
        service.setPageSize();
        expect(service.page).toBe(1);
    });

    it('should return page object', () => {
        expect(service.getPagination()).toEqual({
            page: 1,
            pageSize: 50,
            filteredLoansSize: 0
        });
    });
});