export interface Report {
  id: string;
  reporterId: string;
  reportedId: string;
  reason: string;
  description?: string;
  status: 'PENDING' | 'REVIEWED' | 'RESOLVED';
  createdAt: string;
}

export interface CreateReportData {
  reportedId: string;
  reason: string;
  description?: string;
}
