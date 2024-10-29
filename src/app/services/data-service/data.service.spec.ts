import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DataService } from './data.service';
import { Loan } from '../../models/loan.model';

describe('DataService', () => {
    let service: DataService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [DataService]
        });
        service = TestBed.inject(DataService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should fetch data successfully', () => {
        const dummyData: Loan[] = [{
            issuance_date: '2023-01-01',
            actual_return_date: '2023-01-10',
            return_date: '2023-01-15',
            body: 100,
            percent: 10,
            user: 'John Doe'
        }];


        service.getData().subscribe(data => {
            return expect(data).toEqual(dummyData);
        });

        const req = httpMock.expectOne(service['apiUrl']);
        expect(req.request.method).toBe('GET');
        req.flush(dummyData);
    });
});