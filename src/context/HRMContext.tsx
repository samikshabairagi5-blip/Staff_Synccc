import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Employee,
  AttendanceRecord,
  LeaveRequest,
  Announcement,
  TrainingProgram,
  NotificationItem,
  PerformanceReview,
  Department,
  LeaveStatus,
  WorkMode
} from '../types/hrm';
import {
  INITIAL_EMPLOYEES,
  INITIAL_ATTENDANCE,
  INITIAL_LEAVES,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_TRAININGS,
  INITIAL_NOTIFICATIONS,
  INITIAL_PERFORMANCE_REVIEWS,
  INITIAL_DEPARTMENTS
} from '../data/mockData';
import { useAuth } from './AuthContext';

interface HRMContextType {
  employees: Employee[];
  departments: Department[];
  attendance: AttendanceRecord[];
  leaves: LeaveRequest[];
  announcements: Announcement[];
  trainings: TrainingProgram[];
  notifications: NotificationItem[];
  reviews: PerformanceReview[];

  // Employee CRUD
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;

  // Attendance actions
  clockIn: (workMode: WorkMode, notes?: string, location?: string) => void;
  clockOut: () => void;
  getTodayRecord: (employeeId?: string) => AttendanceRecord | undefined;

  // Leave actions
  applyLeave: (leave: Omit<LeaveRequest, 'id' | 'appliedAt' | 'status'>) => void;
  reviewLeave: (leaveId: string, status: LeaveStatus, managerComment?: string) => void;

  // Announcements
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'date'>) => void;
  deleteAnnouncement: (id: string) => void;
  togglePinAnnouncement: (id: string) => void;

  // Training
  enrollTraining: (trainingId: string) => void;
  toggleModuleComplete: (trainingId: string, moduleId: string) => void;
  issueCertificate: (trainingId: string) => void;

  // Performance Reviews
  submitReview: (review: Omit<PerformanceReview, 'id' | 'date'>) => void;

  // Notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Reset demo data
  resetToDefaults: () => void;
}

const HRMContext = createContext<HRMContextType | undefined>(undefined);

const STORAGE_KEYS = {
  EMPLOYEES: 'nexushr_data_employees',
  DEPARTMENTS: 'nexushr_data_departments',
  ATTENDANCE: 'nexushr_data_attendance',
  LEAVES: 'nexushr_data_leaves',
  ANNOUNCEMENTS: 'nexushr_data_announcements',
  TRAININGS: 'nexushr_data_trainings',
  NOTIFICATIONS: 'nexushr_data_notifications',
  REVIEWS: 'nexushr_data_reviews'
};

export const HRMProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const [employees, setEmployees] = useState<Employee[]>(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EMPLOYEES);
      return data ? JSON.parse(data) : INITIAL_EMPLOYEES;
    } catch {
      return INITIAL_EMPLOYEES;
    }
  });

  const [departments] = useState<Department[]>(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DEPARTMENTS);
      return data ? JSON.parse(data) : INITIAL_DEPARTMENTS;
    } catch {
      return INITIAL_DEPARTMENTS;
    }
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
      return data ? JSON.parse(data) : INITIAL_ATTENDANCE;
    } catch {
      return INITIAL_ATTENDANCE;
    }
  });

  const [leaves, setLeaves] = useState<LeaveRequest[]>(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LEAVES);
      return data ? JSON.parse(data) : INITIAL_LEAVES;
    } catch {
      return INITIAL_LEAVES;
    }
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS);
      return data ? JSON.parse(data) : INITIAL_ANNOUNCEMENTS;
    } catch {
      return INITIAL_ANNOUNCEMENTS;
    }
  });

  const [trainings, setTrainings] = useState<TrainingProgram[]>(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TRAININGS);
      return data ? JSON.parse(data) : INITIAL_TRAININGS;
    } catch {
      return INITIAL_TRAININGS;
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return data ? JSON.parse(data) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [reviews, setReviews] = useState<PerformanceReview[]>(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      return data ? JSON.parse(data) : INITIAL_PERFORMANCE_REVIEWS;
    } catch {
      return INITIAL_PERFORMANCE_REVIEWS;
    }
  });

  // Sync back to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LEAVES, JSON.stringify(leaves));
  }, [leaves]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRAININGS, JSON.stringify(trainings));
  }, [trainings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  }, [reviews]);

  // Employee actions
  const addEmployee = (empData: Omit<Employee, 'id'>) => {
    const newEmp: Employee = {
      ...empData,
      id: `usr_emp_${Date.now()}`
    };
    setEmployees((prev) => [newEmp, ...prev]);

    // Add notification to HR
    addSystemNotification({
      title: 'New Employee Added',
      message: `${newEmp.name} (${newEmp.designation}) has been registered in the system.`,
      type: 'system',
      targetRole: 'hr'
    });
  };

  const updateEmployee = (id: string, updates: Partial<Employee>) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === id ? { ...emp, ...updates } : emp))
    );
  };

  const deleteEmployee = (id: string) => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== id));
  };

  // Helper for notification
  const addSystemNotification = (data: {
    title: string;
    message: string;
    type: 'leave' | 'attendance' | 'announcement' | 'training' | 'performance' | 'system';
    userId?: string;
    targetRole?: 'employee' | 'manager' | 'hr' | 'all';
    linkTab?: string;
  }) => {
    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      userId: data.userId || 'all',
      targetRole: data.targetRole || 'all',
      title: data.title,
      message: data.message,
      type: data.type,
      timestamp: 'Just now',
      read: false,
      linkTab: data.linkTab
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  // Attendance actions
  const getTodayRecord = (empId?: string) => {
    const targetId = empId || user?.employeeId;
    if (!targetId) return undefined;
    const today = new Date().toISOString().split('T')[0];
    return attendance.find((a) => a.employeeId === targetId && a.date === today);
  };

  const clockIn = (workMode: WorkMode, notes?: string, location?: string) => {
    if (!user) return;
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0]; // HH:mm:ss

    // Check if late (after 09:15)
    const isLate = now.getHours() > 9 || (now.getHours() === 9 && now.getMinutes() > 15);

    const existingIndex = attendance.findIndex(
      (a) => a.employeeId === user.employeeId && a.date === today
    );

    const newRecord: AttendanceRecord = {
      id: `att_${Date.now()}`,
      employeeId: user.employeeId,
      employeeName: user.name,
      department: user.department,
      date: today,
      clockIn: timeStr,
      status: isLate ? 'late' : 'present',
      workMode,
      location: location || (workMode === 'office' ? 'SF HQ - Floor 4' : 'Remote Office'),
      notes: notes || undefined
    };

    if (existingIndex >= 0) {
      setAttendance((prev) => {
        const copy = [...prev];
        copy[existingIndex] = newRecord;
        return copy;
      });
    } else {
      setAttendance((prev) => [newRecord, ...prev]);
    }

    addSystemNotification({
      title: 'Clocked In Successfully',
      message: `You clocked in at ${timeStr} (${workMode}). Have a productive workday!`,
      type: 'attendance',
      userId: user.id
    });
  };

  const clockOut = () => {
    if (!user) return;
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];

    setAttendance((prev) =>
      prev.map((rec) => {
        if (rec.employeeId === user.employeeId && rec.date === today) {
          // Calculate duration in hours
          const [inH, inM] = rec.clockIn.split(':').map(Number);
          const [outH, outM] = timeStr.split(':').map(Number);
          const diffHours = Math.max(0.1, Number(((outH * 60 + outM - (inH * 60 + inM)) / 60).toFixed(2)));

          return {
            ...rec,
            clockOut: timeStr,
            totalHours: diffHours
          };
        }
        return rec;
      })
    );

    addSystemNotification({
      title: 'Clocked Out',
      message: `You clocked out at ${timeStr}. Time tracked successfully.`,
      type: 'attendance',
      userId: user.id
    });
  };

  // Leaves
  const applyLeave = (leaveData: Omit<LeaveRequest, 'id' | 'appliedAt' | 'status'>) => {
    const newLeave: LeaveRequest = {
      ...leaveData,
      id: `leave_${Date.now()}`,
      appliedAt: new Date().toISOString().split('T')[0],
      status: 'pending'
    };

    setLeaves((prev) => [newLeave, ...prev]);

    // Notify manager & HR
    addSystemNotification({
      title: 'New Leave Request Submitted',
      message: `${leaveData.employeeName} applied for ${leaveData.daysCount} days of ${leaveData.leaveType} leave.`,
      type: 'leave',
      targetRole: 'manager',
      linkTab: 'leaves'
    });
  };

  const reviewLeave = (leaveId: string, status: LeaveStatus, managerComment?: string) => {
    const today = new Date().toISOString().split('T')[0];
    let employeeIdToNotify = '';
    let leaveType = '';
    let days = 0;

    setLeaves((prev) =>
      prev.map((leave) => {
        if (leave.id === leaveId) {
          employeeIdToNotify = leave.employeeId;
          leaveType = leave.leaveType;
          days = leave.daysCount;
          return {
            ...leave,
            status,
            managerComment: managerComment || (status === 'approved' ? 'Approved by manager.' : 'Request rejected.'),
            reviewedBy: user?.name || 'Manager',
            reviewerRole: user?.role === 'hr' ? 'HR Administrator' : 'Direct Manager',
            reviewedAt: today
          };
        }
        return leave;
      })
    );

    // If approved, deduct leave balance
    if (status === 'approved' && employeeIdToNotify) {
      setEmployees((prev) =>
        prev.map((emp) => {
          if (emp.employeeId === employeeIdToNotify) {
            const currentBal = emp.leaveBalance;
            const updatedBal = { ...currentBal };
            if (leaveType === 'annual') updatedBal.annual = Math.max(0, updatedBal.annual - days);
            else if (leaveType === 'sick') updatedBal.sick = Math.max(0, updatedBal.sick - days);
            else if (leaveType === 'casual') updatedBal.casual = Math.max(0, updatedBal.casual - days);
            else if (leaveType === 'maternity') updatedBal.maternity = Math.max(0, updatedBal.maternity - days);

            return { ...emp, leaveBalance: updatedBal };
          }
          return emp;
        })
      );
    }

    addSystemNotification({
      title: `Leave Request ${status === 'approved' ? 'Approved' : 'Rejected'}`,
      message: `Your leave request has been ${status} by ${user?.name || 'management'}.`,
      type: 'leave',
      userId: employeeIdToNotify
    });
  };

  // Announcements
  const addAnnouncement = (ann: Omit<Announcement, 'id' | 'date'>) => {
    const newAnn: Announcement = {
      ...ann,
      id: `ann_${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    setAnnouncements((prev) => [newAnn, ...prev]);

    addSystemNotification({
      title: `New Announcement: ${newAnn.title}`,
      message: newAnn.content.slice(0, 100) + '...',
      type: 'announcement',
      targetRole: 'all',
      linkTab: 'announcements'
    });
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  const togglePinAnnouncement = (id: string) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isPinned: !a.isPinned } : a))
    );
  };

  // Training
  const enrollTraining = (trainingId: string) => {
    if (!user) return;
    setTrainings((prev) =>
      prev.map((t) => {
        if (t.id === trainingId) {
          const ids = t.enrolledEmployeeIds.includes(user.id)
            ? t.enrolledEmployeeIds
            : [...t.enrolledEmployeeIds, user.id];
          return {
            ...t,
            enrolledEmployeeIds: ids,
            enrolledCount: ids.length,
            status: t.status === 'completed' ? 'completed' : 'in_progress'
          };
        }
        return t;
      })
    );

    addSystemNotification({
      title: 'Enrolled in Training Program',
      message: `You successfully enrolled in training. Start learning at your pace!`,
      type: 'training',
      userId: user.id
    });
  };

  const toggleModuleComplete = (trainingId: string, moduleId: string) => {
    setTrainings((prev) =>
      prev.map((t) => {
        if (t.id === trainingId) {
          const updatedModules = t.modules.map((m) =>
            m.id === moduleId ? { ...m, completed: !m.completed } : m
          );
          const allDone = updatedModules.every((m) => m.completed);
          const certIssued = allDone ? true : t.certificateIssued;
          const certId = allDone && !t.certificateId ? `NX-CERT-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}` : t.certificateId;

          return {
            ...t,
            modules: updatedModules,
            status: allDone ? 'completed' : 'in_progress',
            completionDate: allDone ? new Date().toISOString().split('T')[0] : t.completionDate,
            certificateIssued: certIssued,
            certificateId: certId
          };
        }
        return t;
      })
    );
  };

  const issueCertificate = (trainingId: string) => {
    setTrainings((prev) =>
      prev.map((t) => {
        if (t.id === trainingId) {
          return {
            ...t,
            certificateIssued: true,
            certificateId: t.certificateId || `NX-CERT-2026-${Math.floor(10000 + Math.random() * 90000)}`
          };
        }
        return t;
      })
    );
  };

  // Reviews
  const submitReview = (revData: Omit<PerformanceReview, 'id' | 'date'>) => {
    const newRev: PerformanceReview = {
      ...revData,
      id: `rev_${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    setReviews((prev) => [newRev, ...prev]);

    // Update employee performance score in roster
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.employeeId === revData.employeeId
          ? { ...emp, performanceScore: revData.rating }
          : emp
      )
    );

    addSystemNotification({
      title: 'Performance Review Completed',
      message: `A performance evaluation for ${revData.employeeName} has been recorded (Rating: ${revData.rating}/5.0).`,
      type: 'performance',
      targetRole: 'manager'
    });
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Reset to default
  const resetToDefaults = () => {
    localStorage.removeItem(STORAGE_KEYS.EMPLOYEES);
    localStorage.removeItem(STORAGE_KEYS.ATTENDANCE);
    localStorage.removeItem(STORAGE_KEYS.LEAVES);
    localStorage.removeItem(STORAGE_KEYS.ANNOUNCEMENTS);
    localStorage.removeItem(STORAGE_KEYS.TRAININGS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.REVIEWS);

    setEmployees(INITIAL_EMPLOYEES);
    setAttendance(INITIAL_ATTENDANCE);
    setLeaves(INITIAL_LEAVES);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setTrainings(INITIAL_TRAININGS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setReviews(INITIAL_PERFORMANCE_REVIEWS);
  };

  return (
    <HRMContext.Provider
      value={{
        employees,
        departments,
        attendance,
        leaves,
        announcements,
        trainings,
        notifications,
        reviews,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        clockIn,
        clockOut,
        getTodayRecord,
        applyLeave,
        reviewLeave,
        addAnnouncement,
        deleteAnnouncement,
        togglePinAnnouncement,
        enrollTraining,
        toggleModuleComplete,
        issueCertificate,
        submitReview,
        markNotificationRead,
        markAllNotificationsRead,
        resetToDefaults
      }}
    >
      {children}
    </HRMContext.Provider>
  );
};

export const useHRM = () => {
  const context = useContext(HRMContext);
  if (!context) {
    throw new Error('useHRM must be used within an HRMProvider');
  }
  return context;
};
