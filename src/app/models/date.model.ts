import { WritableSignal }  from '@angular/core';
export interface DateFilters {
    startDate: WritableSignal<Date | null>;
    endDate: WritableSignal<Date | null>;
    actualReturnStartDate: WritableSignal<Date | null>;
    actualReturnEndDate: WritableSignal<Date | null>;
    showOverdueOnly: WritableSignal<boolean>;
}