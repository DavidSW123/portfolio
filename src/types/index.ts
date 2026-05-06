export type Role = "ADMIN" | "DEVELOPER" | "PROVIDER" | "COLLABORATOR" | "CLIENT";
export type CarStatus = "PENDING" | "APPROVED" | "REJECTED" | "PUBLISHED";
export type CarSource = "MANUAL" | "API" | "ADMIN";

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: Role;
  image?: string | null;
}

export interface CarWithRelations {
  id: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  mileage?: number | null;
  color?: string | null;
  fuelType?: string | null;
  transmission?: string | null;
  engine?: string | null;
  doors?: number | null;
  description?: string | null;
  basePrice: number;
  markup: number;
  finalPrice: number;
  status: string;
  source: string;
  isPublished: boolean;
  externalId?: string | null;
  submittedById: string;
  approvedById?: string | null;
  approvedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  submittedBy: { id: string; name: string; email: string; role: string };
  approvedBy?: { id: string; name: string } | null;
  photos: { id: string; url: string; filename: string; order: number }[];
  comments: { id: string; content: string; authorName?: string | null; isInternal: boolean; createdAt: Date }[];
}
