import type { 
  LeaveRequest, 
  LeaveBalance, 
  LeaveType,
  LeaveStatus,
  CreateLeaveRequestInput,
  UpdateLeaveRequestInput,
  CreateLeaveBalanceInput,
  UpdateLeaveBalanceInput
} from '../types/hrm.types';

const LEAVE_REQUESTS_KEY = 'leave_requests';
const LEAVE_BALANCES_KEY = 'leave_balances';

// Helper function to calculate business days between two dates
function calculateBusinessDays(startDate: Date, endDate: Date, halfDayStart: boolean = false, halfDayEnd: boolean = false): number {
  let count = 0;
  const current = new Date(startDate);
  
  while (current <= endDate) {
    const dayOfWeek = current.getDay();
    // Skip weekends (0 = Sunday, 6 = Saturday)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  
  // Adjust for half days
  if (halfDayStart) count -= 0.5;
  if (halfDayEnd) count -= 0.5;
  
  return count;
}

// Leave Request CRUD Operations
export const leaveService = {
  // Get all leave requests
  getAllLeaveRequests(): LeaveRequest[] {
    const data = localStorage.getItem(LEAVE_REQUESTS_KEY);
    return data ? JSON.parse(data) : [];
  },

  // Get leave requests by employee ID
  getLeaveRequestsByEmployee(employeeId: string): LeaveRequest[] {
    const allRequests = this.getAllLeaveRequests();
    return allRequests.filter(request => request.employeeId === employeeId);
  },

  // Get leave requests by status
  getLeaveRequestsByStatus(status: LeaveStatus): LeaveRequest[] {
    const allRequests = this.getAllLeaveRequests();
    return allRequests.filter(request => request.status === status);
  },

  // Get pending leave requests for approval
  getPendingLeaveRequests(): LeaveRequest[] {
    return this.getLeaveRequestsByStatus('pending');
  },

  // Get leave request by ID
  getLeaveRequestById(id: string): LeaveRequest | undefined {
    const allRequests = this.getAllLeaveRequests();
    return allRequests.find(request => request.id === id);
  },

  // Create new leave request
  createLeaveRequest(input: CreateLeaveRequestInput): LeaveRequest {
    const allRequests = this.getAllLeaveRequests();
    
    // Calculate total days
    const startDate = new Date(input.startDate);
    const endDate = new Date(input.endDate);
    const totalDays = calculateBusinessDays(
      startDate, 
      endDate, 
      input.halfDayStart, 
      input.halfDayEnd
    );

    const newRequest: LeaveRequest = {
      ...input,
      id: `leave_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      totalDays,
      requestedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    allRequests.push(newRequest);
    localStorage.setItem(LEAVE_REQUESTS_KEY, JSON.stringify(allRequests));

    // Update leave balance if approved automatically
    if (newRequest.status === 'approved') {
      this.updateLeaveBalanceAfterApproval(newRequest);
    }

    return newRequest;
  },

  // Update leave request
  updateLeaveRequest(id: string, input: UpdateLeaveRequestInput): LeaveRequest | null {
    const allRequests = this.getAllLeaveRequests();
    const index = allRequests.findIndex(request => request.id === id);

    if (index === -1) return null;

    const existingRequest = allRequests[index];
    
    // Recalculate total days if dates changed
    let totalDays = existingRequest.totalDays;
    if (input.startDate || input.endDate || input.halfDayStart !== undefined || input.halfDayEnd !== undefined) {
      const startDate = new Date(input.startDate || existingRequest.startDate);
      const endDate = new Date(input.endDate || existingRequest.endDate);
      totalDays = calculateBusinessDays(
        startDate,
        endDate,
        input.halfDayStart ?? existingRequest.halfDayStart,
        input.halfDayEnd ?? existingRequest.halfDayEnd
      );
    }

    const updatedRequest: LeaveRequest = {
      ...existingRequest,
      ...input,
      totalDays,
      updatedAt: new Date().toISOString(),
    };

    allRequests[index] = updatedRequest;
    localStorage.setItem(LEAVE_REQUESTS_KEY, JSON.stringify(allRequests));

    // Update leave balance if status changed to approved
    if (input.status === 'approved' && existingRequest.status !== 'approved') {
      this.updateLeaveBalanceAfterApproval(updatedRequest);
    } else if (input.status === 'rejected' && existingRequest.status === 'pending') {
      this.updateLeaveBalanceAfterRejection(updatedRequest);
    }

    return updatedRequest;
  },

  // Approve leave request
  approveLeaveRequest(id: string, reviewerId: string, comments?: string): LeaveRequest | null {
    return this.updateLeaveRequest(id, {
      status: 'approved',
      reviewedBy: reviewerId,
      reviewedAt: new Date().toISOString(),
      reviewComments: comments,
    });
  },

  // Reject leave request
  rejectLeaveRequest(id: string, reviewerId: string, comments: string): LeaveRequest | null {
    return this.updateLeaveRequest(id, {
      status: 'rejected',
      reviewedBy: reviewerId,
      reviewedAt: new Date().toISOString(),
      reviewComments: comments,
    });
  },

  // Cancel leave request
  cancelLeaveRequest(id: string): LeaveRequest | null {
    const request = this.getLeaveRequestById(id);
    if (!request) return null;

    const updated = this.updateLeaveRequest(id, {
      status: 'cancelled',
    });

    // Restore leave balance if it was approved
    if (request.status === 'approved' && updated) {
      this.restoreLeaveBalanceAfterCancellation(updated);
    }

    return updated;
  },

  // Delete leave request
  deleteLeaveRequest(id: string): boolean {
    const allRequests = this.getAllLeaveRequests();
    const filtered = allRequests.filter(request => request.id !== id);
    
    if (filtered.length === allRequests.length) return false;

    localStorage.setItem(LEAVE_REQUESTS_KEY, JSON.stringify(filtered));
    return true;
  },

  // Get leave requests for a date range
  getLeaveRequestsInRange(startDate: string, endDate: string): LeaveRequest[] {
    const allRequests = this.getAllLeaveRequests();
    const start = new Date(startDate);
    const end = new Date(endDate);

    return allRequests.filter(request => {
      const requestStart = new Date(request.startDate);
      const requestEnd = new Date(request.endDate);
      
      // Check if there's any overlap
      return (requestStart <= end && requestEnd >= start);
    });
  },

  // Get approved leave requests for calendar view
  getApprovedLeaveRequestsInRange(startDate: string, endDate: string): LeaveRequest[] {
    const requests = this.getLeaveRequestsInRange(startDate, endDate);
    return requests.filter(request => request.status === 'approved');
  },

  // Check for leave conflicts
  checkLeaveConflicts(employeeId: string, startDate: string, endDate: string, excludeRequestId?: string): LeaveRequest[] {
    const allRequests = this.getLeaveRequestsByEmployee(employeeId);
    const start = new Date(startDate);
    const end = new Date(endDate);

    return allRequests.filter(request => {
      if (excludeRequestId && request.id === excludeRequestId) return false;
      if (request.status === 'rejected' || request.status === 'cancelled') return false;

      const requestStart = new Date(request.startDate);
      const requestEnd = new Date(request.endDate);
      
      return (requestStart <= end && requestEnd >= start);
    });
  },

  // Update leave balance after approval
  updateLeaveBalanceAfterApproval(request: LeaveRequest): void {
    const balance = leaveBalanceService.getLeaveBalance(
      request.employeeId,
      new Date(request.startDate).getFullYear(),
      request.type
    );

    if (balance) {
      leaveBalanceService.updateLeaveBalance(balance.id, {
        usedDays: balance.usedDays + request.totalDays,
        pendingDays: Math.max(0, balance.pendingDays - request.totalDays),
        remainingDays: balance.totalDays - (balance.usedDays + request.totalDays),
      });
    }
  },

  // Update leave balance after rejection
  updateLeaveBalanceAfterRejection(request: LeaveRequest): void {
    const balance = leaveBalanceService.getLeaveBalance(
      request.employeeId,
      new Date(request.startDate).getFullYear(),
      request.type
    );

    if (balance) {
      leaveBalanceService.updateLeaveBalance(balance.id, {
        pendingDays: Math.max(0, balance.pendingDays - request.totalDays),
        remainingDays: balance.totalDays - balance.usedDays,
      });
    }
  },

  // Restore leave balance after cancellation
  restoreLeaveBalanceAfterCancellation(request: LeaveRequest): void {
    const balance = leaveBalanceService.getLeaveBalance(
      request.employeeId,
      new Date(request.startDate).getFullYear(),
      request.type
    );

    if (balance) {
      leaveBalanceService.updateLeaveBalance(balance.id, {
        usedDays: Math.max(0, balance.usedDays - request.totalDays),
        remainingDays: balance.totalDays - Math.max(0, balance.usedDays - request.totalDays),
      });
    }
  },
};

// Leave Balance Service
export const leaveBalanceService = {
  // Get all leave balances
  getAllLeaveBalances(): LeaveBalance[] {
    const data = localStorage.getItem(LEAVE_BALANCES_KEY);
    return data ? JSON.parse(data) : [];
  },

  // Get leave balances by employee ID
  getLeaveBalancesByEmployee(employeeId: string): LeaveBalance[] {
    const allBalances = this.getAllLeaveBalances();
    return allBalances.filter(balance => balance.employeeId === employeeId);
  },

  // Get leave balance for specific employee, year, and type
  getLeaveBalance(employeeId: string, year: number, leaveType: LeaveType): LeaveBalance | undefined {
    const allBalances = this.getAllLeaveBalances();
    return allBalances.find(
      balance => balance.employeeId === employeeId && 
                 balance.year === year && 
                 balance.leaveType === leaveType
    );
  },

  // Get leave balance by ID
  getLeaveBalanceById(id: string): LeaveBalance | undefined {
    const allBalances = this.getAllLeaveBalances();
    return allBalances.find(balance => balance.id === id);
  },

  // Create new leave balance
  createLeaveBalance(input: CreateLeaveBalanceInput): LeaveBalance {
    const allBalances = this.getAllLeaveBalances();

    const newBalance: LeaveBalance = {
      ...input,
      id: `balance_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    allBalances.push(newBalance);
    localStorage.setItem(LEAVE_BALANCES_KEY, JSON.stringify(allBalances));

    return newBalance;
  },

  // Update leave balance
  updateLeaveBalance(id: string, input: UpdateLeaveBalanceInput): LeaveBalance | null {
    const allBalances = this.getAllLeaveBalances();
    const index = allBalances.findIndex(balance => balance.id === id);

    if (index === -1) return null;

    const updatedBalance: LeaveBalance = {
      ...allBalances[index],
      ...input,
      updatedAt: new Date().toISOString(),
    };

    allBalances[index] = updatedBalance;
    localStorage.setItem(LEAVE_BALANCES_KEY, JSON.stringify(allBalances));

    return updatedBalance;
  },

  // Delete leave balance
  deleteLeaveBalance(id: string): boolean {
    const allBalances = this.getAllLeaveBalances();
    const filtered = allBalances.filter(balance => balance.id !== id);
    
    if (filtered.length === allBalances.length) return false;

    localStorage.setItem(LEAVE_BALANCES_KEY, JSON.stringify(filtered));
    return true;
  },

  // Initialize leave balances for an employee for a year
  initializeEmployeeLeaveBalances(employeeId: string, year: number): LeaveBalance[] {
    const leaveTypes: LeaveType[] = ['vacation', 'sick', 'care', 'parental', 'special', 'unpaid', 'compensatory'];
    const defaultDays: Record<LeaveType, number> = {
      vacation: 25,        // Standard vacation days in NL
      sick: 0,            // Unlimited sick leave in NL
      care: 10,           // Care leave days
      parental: 0,        // Parental leave (special calculation)
      special: 5,         // Special leave days
      unpaid: 0,          // Unpaid leave (unlimited)
      compensatory: 0,    // Compensatory leave (earned through overtime)
    };

    const balances: LeaveBalance[] = [];

    for (const leaveType of leaveTypes) {
      const existing = this.getLeaveBalance(employeeId, year, leaveType);
      
      if (!existing) {
        const balance = this.createLeaveBalance({
          employeeId,
          year,
          leaveType,
          totalDays: defaultDays[leaveType],
          usedDays: 0,
          pendingDays: 0,
          remainingDays: defaultDays[leaveType],
        });
        balances.push(balance);
      } else {
        balances.push(existing);
      }
    }

    return balances;
  },

  // Calculate total remaining days for all leave types
  getTotalRemainingDays(employeeId: string, year: number): number {
    const balances = this.getLeaveBalancesByEmployee(employeeId);
    const yearBalances = balances.filter(b => b.year === year);
    
    return yearBalances.reduce((total, balance) => {
      // Only count leave types with limits
      if (balance.leaveType === 'vacation' || balance.leaveType === 'care' || balance.leaveType === 'special') {
        return total + balance.remainingDays;
      }
      return total;
    }, 0);
  },
};

// Export helper function for external use
export { calculateBusinessDays };
