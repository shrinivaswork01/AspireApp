
export enum BookingStatus {
  INQUIRY = 'Inquiry',
  CONFIRMED = 'Confirmed',
  COMPLETED = 'Completed',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled'
}

export enum TaskType {
  SHOOT = 'Shoot',
  EDITING = 'Editing',
  ALBUM = 'Album',
  DELIVERY = 'Delivery'
}

export enum TaskStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  DONE = 'Done'
}

export enum UserRole {
  SUPER_ADMIN = 'Super Admin',
  MANAGER = 'Manager',
  PHOTOGRAPHER = 'Photographer',
  EDITOR = 'Editor',
  EMPLOYEE = 'Employee'
}

export interface Employee {
  id: string;
  user_id?: string;
  full_name: string;
  email: string;
  role: UserRole;
  phone?: string;
  created_at: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
  tags: string[];
  created_at: string;
}

export interface Package {
  id: string;
  name: string;
  price: number;
  duration: string;
  deliverables: string[];
}

export interface Booking {
  id: string;
  client_id: string;
  package_id: string;
  event_type: string;
  event_date: string;
  location: string;
  total_amount: number;
  advance_paid: number;
  status: BookingStatus;
  created_at: string;
}

export interface Task {
  id: string;
  booking_id: string;
  assigned_to?: string; // ID of Employee
  type: TaskType;
  status: TaskStatus;
  due_date: string;
  title: string;
}

export interface Insight {
  title: string;
  content: string;
  type: 'positive' | 'neutral' | 'action';
}