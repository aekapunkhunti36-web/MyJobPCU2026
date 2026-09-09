import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LoginView } from './components/auth/LoginView';
import { Sidebar } from './components/layout/Sidebar';
import { TopNavbar } from './components/layout/TopNavbar';
import { DashboardView } from './components/dashboard/DashboardView';
import { ProjectsView } from './components/projects/ProjectsView';
import { TasksView } from './components/tasks/TasksView';
import { WorkgroupsView } from './components/workgroups/WorkgroupsView';
import { PersonnelView } from './components/personnel/PersonnelView';
import { KpiView } from './components/kpi/KpiView';
import { CalendarView } from './components/calendar/CalendarView';
import { EvidenceView } from './components/evidence/EvidenceView';
import { ReportsView } from './components/reports/ReportsView';
import { NotificationsView } from './components/notifications/NotificationsView';
import { EpidemView } from './components/epidem/EpidemView';
import { HealthPromotionView } from './components/healthPromotion/HealthPromotionView';
import { AncView } from './components/anc/AncView';
import { SettingsView } from './components/settings/SettingsView';
import { TaskFormModal } from './components/tasks/TaskFormModal';
import { TaskDetailModal } from './components/tasks/TaskDetailModal';

const AppContent: React.FC = () => {
  const { 
    activeTab, 
    isAuthenticated,
    isCreateTaskModalOpen,
    setIsCreateTaskModalOpen,
    taskToEdit,
    setTaskToEdit,
    selectedTaskForDetail,
    setSelectedTaskForDetail
  } = useApp();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // If user is not authenticated, show the login screen
  if (!isAuthenticated) {
    return <LoginView />;
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'projects':
        return <ProjectsView />;
      case 'tasks':
        return <TasksView />;
      case 'workgroups':
        return <WorkgroupsView />;
      case 'personnel':
        return <PersonnelView />;
      case 'kpi':
        return <KpiView />;
      case 'calendar':
        return <CalendarView />;
      case 'evidence':
        return <EvidenceView />;
      case 'reports':
        return <ReportsView />;
      case 'epidem':
        return <EpidemView />;
      case 'health_promotion':
        return <HealthPromotionView />;
      case 'anc':
        return <AncView />;
      case 'notifications':
        return <NotificationsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F1F5F9] text-slate-900 font-sans overflow-hidden selection:bg-emerald-600 selection:text-white">
      {/* Collapsible Sidebar */}
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <TopNavbar setIsMobileOpen={setIsMobileOpen} />

        {/* Dynamic View Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* Global Modals */}
      <TaskFormModal
        isOpen={isCreateTaskModalOpen}
        onClose={() => {
          setIsCreateTaskModalOpen(false);
          setTaskToEdit(null);
        }}
        taskToEdit={taskToEdit}
      />
      {selectedTaskForDetail && (
        <TaskDetailModal
          task={selectedTaskForDetail}
          onClose={() => setSelectedTaskForDetail(null)}
          onEdit={(task) => {
            setSelectedTaskForDetail(null);
            setTaskToEdit(task);
            setIsCreateTaskModalOpen(true);
          }}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
