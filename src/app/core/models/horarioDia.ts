export interface HorarioDia {
    dayOfWeek: number; // 0 = Domingo, 1 = Segunda...
    dayName: string;
    isOpen: boolean;
    openTime: string; 
    closeTime: string;
}