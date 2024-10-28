import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Marks this class as available to be provided and injected as a dependency in the root injector
@Injectable({
  providedIn: 'root'
})
export class DataService {
  // URL to the API endpoint or local JSON file
  private apiUrl = 
  // 'assets/test.json'; // local file
   'https://raw.githubusercontent.com/LightOfTheSun/front-end-coding-task-db/master/db.json';

  // Injects HttpClient service to make HTTP requests
  constructor(private http: HttpClient) { }

  // Method to fetch data from the API
  getData(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // Method to fetch paginated data from the API
  getDataLazy(page: number, pageSize: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?_page=${page}&_limit=${pageSize}`);
  }
}