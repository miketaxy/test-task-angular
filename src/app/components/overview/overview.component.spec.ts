import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { OverviewComponent } from './overview.component';
import { DataService } from '../../services/data.service';
import { of } from 'rxjs';
import { Loan } from '../../models/loan.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';
describe('OverviewComponent', () => {
    let component: OverviewComponent;
    let fixture: ComponentFixture<OverviewComponent>;
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
            providers: [DataService]
        }).compileComponents();

        fixture = TestBed.createComponent(OverviewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create the component', () => {
        expect(component).toBeTruthy();
    });
    it('should filter loans by start date', () => {
        component.loans.set(mockLoans);
        component.startDate.set(new Date('2020-01-12'));
        component.applyFilters();
        expect(component.filteredLoans()).toEqual(mockLoans.slice(1));
    });
    it('should filter loans by end date', () => {
        component.loans.set(mockLoans);
        component.endDate.set(new Date('2020-01-25'));
        component.applyFilters();
        expect(component.filteredLoans()).toEqual(mockLoans.slice(0, 3));
    });
    it('should filter loans by start and end date', () => {
        component.loans.set(mockLoans);
        component.startDate.set(new Date('2020-01-12'));
        component.endDate.set(new Date('2020-01-25'));
        component.applyFilters();
        expect(component.filteredLoans()).toEqual(mockLoans.slice(1, 3));
    });
});