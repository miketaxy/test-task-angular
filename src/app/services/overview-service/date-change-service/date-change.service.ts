import { Injectable, signal, WritableSignal } from "@angular/core";
import { DateFilters } from '../../../models/date.model';
 
@Injectable({
    providedIn : 'root'
})
export class DateChangeService {
    startDate: WritableSignal<Date | null> = signal(null);
    endDate: WritableSignal<Date | null> = signal(null);
    actualReturnStartDate: WritableSignal<Date | null> = signal(null);
    actualReturnEndDate: WritableSignal<Date | null> = signal(null);
    showOverdueOnly: WritableSignal<boolean> = signal(false);
    
    constructor() { }

    onStartDateChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        this.startDate.set(input.value ? new Date(input.value) : null);
      }
    
      onEndDateChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        this.endDate.set(input.value ? new Date(input.value) : null);
      }
    
      onActualReturnStartDateChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        this.actualReturnStartDate.set(input.value ? new Date(input.value) : null);
      }
    
      onActualReturnEndDateChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        this.actualReturnEndDate.set(input.value ? new Date(input.value) : null);
      }
    
      onShowOverdueChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        this.showOverdueOnly.set(input.checked);
      }

      getDate(): DateFilters | null {
        return {
          startDate: this.startDate,
          endDate: this.endDate,
          actualReturnStartDate: this.actualReturnStartDate,
          actualReturnEndDate: this.actualReturnEndDate,
          showOverdueOnly: this.showOverdueOnly
        }
      }
}