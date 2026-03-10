export interface ICourse {
  uuid: string;
  title: string;
  description: string;
  price: number;
  remainingSeats: number;
  isLocked: boolean;
}
