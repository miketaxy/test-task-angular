import { Injectable } from "@angular/core";
import { Page } from "../../../models/page.model";
@Injectable({
    providedIn: 'root'
})
export class PaginationService {
    page: number = 1;
    pageSize: number = 50;
    filteredLoansSize: number = 0;

    constructor() { }

    nextPage(): void {
        this.page++;
    }

    previousPage(): void {
        this.page--;
    }

    goToPage(page: number): void {
        this.page = page;
    }

    setPageSize(): void {
        this.page = 1;
    }

    getPagination(): Page {
        return {
            page: this.page,
            pageSize: this.pageSize,
            filteredLoansSize: this.filteredLoansSize
        };
    }
}