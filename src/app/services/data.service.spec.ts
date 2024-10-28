import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DataService } from './data.service';

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
        const dummyData = { key: 'value' };

        service.getData().subscribe(data => {
            expect(data).toEqual(dummyData);
        });

        const req = httpMock.expectOne(service['apiUrl']);
        expect(req.request.method).toBe('GET');
        req.flush(dummyData);
    });

    it('should fetch paginated data successfully', () => {
        const dummyData = [{ key: 'value1' }, { key: 'value2' }];
        const page = 1;
        const pageSize = 2;

        service.getDataLazy(page, pageSize).subscribe(data => {
            expect(data).toEqual(dummyData);
        });

        const req = httpMock.expectOne(`${service['apiUrl']}?_page=${page}&_limit=${pageSize}`);
        expect(req.request.method).toBe('GET');
        req.flush(dummyData);
    });
});