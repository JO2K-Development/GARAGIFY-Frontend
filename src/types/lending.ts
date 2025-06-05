import { User } from "./user";

export type Lending = {
  id: string;
  borrowers: User[];
  start_date: string;
  end_date: string;
  spot_id: string;
  parking_id: number;
}