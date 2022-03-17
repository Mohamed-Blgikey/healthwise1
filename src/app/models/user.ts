export interface User {
  userId: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  mobile?: string;
  birthDate?: Date;
  imageProfile?: string;
  doctor?: boolean;
  male?: boolean;
}