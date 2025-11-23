import React, { useState } from 'react';
import { Users, Plus, TrendingUp, CheckSquare, Search } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { SkeletonList } from '@/components/common/SkeletonList';
import { useCRM } from '../hooks/useCRM';
import { useToast } from '@/context/ToastContext';
import {
  CustomerList,
  CustomerForm,
  LeadPipeline,
  LeadForm,
  InteractionList,
  InteractionForm,
  TaskList,
  TaskForm,
} from '../components';
import type { Customer, Lead, Interaction, Task } from '../types/crm.types';

export const CRMPage: React.FC = () => {
  const {
    customers,
    leads,
    interactions,
    tasks,
    isLoading,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    createLead,
    updateLead,
    deleteLead,
    convertLeadToCustomer,
    createInteraction,
    updateInteraction,
    deleteInteraction,
    createTask,
    updateTask,
    deleteTask,
  } = useCRM();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'customers' | 'leads' | 'interactions' | 'tasks'>('customers');
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [showInteractionModal, setShowInteractionModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [editingInteraction, setEditingInteraction] = useState<Interaction | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteCustomerConfirm, setShowDeleteCustomerConfirm] = useState(false);
  const [showDeleteLeadConfirm, setShowDeleteLeadConfirm] = useState(false);
  const [showDeleteInteractionConfirm, setShowDeleteInteractionConfirm] = useState(false);
  const [showDeleteTaskConfirm, setShowDeleteTaskConfirm] = useState(false);
  const [showConvertLeadConfirm, setShowConvertLeadConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [leadToConvert, setLeadToConvert] = useState<string | null>(null);

  // Statistics
  const activeLeads = leads.filter(l => l.status !== 'won' && l.status !== 'lost').length;
  const conversionRate = leads.length > 0
    ? Math.round((leads.filter(l => l.status === 'won').length / leads.length) * 100)
    : 0;
  const overdueTasks = tasks.filter(t => {
    if (!t.dueDate || t.status === 'done') return false;
    return new Date(t.dueDate) < new Date();
  }).length;

  // Filtered data
  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.company?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredLeads = leads.filter(l =>
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.company?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredInteractions = interactions.filter(i =>
    i.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTasks = tasks.filter(t =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handlers
  const handleCreateCustomer = async (data: any) => {
    await createCustomer(data);
    showToast('Klant succesvol aangemaakt', 'success');
    setShowCustomerModal(false);
    setEditingCustomer(null);
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setShowCustomerModal(true);
  };

  const handleUpdateCustomer = async (data: any) => {
    if (editingCustomer) {
      await updateCustomer(editingCustomer.id, data);
      showToast('Klant succesvol bijgewerkt', 'success');
      setShowCustomerModal(false);
      setEditingCustomer(null);
    }
  };

  const handleDeleteCustomer = (id: string) => {
    setItemToDelete(id);
    setShowDeleteCustomerConfirm(true);
  };

  const confirmDeleteCustomer = async () => {
    if (itemToDelete) {
      await deleteCustomer(itemToDelete);
      showToast('Klant verwijderd', 'info');
      setItemToDelete(null);
      setShowDeleteCustomerConfirm(false);
    }
  };

  const handleCreateLead = async (data: any) => {
    await createLead(data);
    showToast('Lead succesvol aangemaakt', 'success');
    setShowLeadModal(false);
    setEditingLead(null);
  };

  const handleEditLead = (lead: Lead) => {
    setEditingLead(lead);
    setShowLeadModal(true);
  };

  const handleUpdateLead = async (data: any) => {
    if (editingLead) {
      await updateLead(editingLead.id, data);
      showToast('Lead succesvol bijgewerkt', 'success');
      setShowLeadModal(false);
      setEditingLead(null);
    }
  };

  const handleDeleteLead = (id: string) => {
    setItemToDelete(id);
    setShowDeleteLeadConfirm(true);
  };

  const confirmDeleteLead = async () => {
    if (itemToDelete) {
      await deleteLead(itemToDelete);
      showToast('Lead verwijderd', 'info');
      setItemToDelete(null);
      setShowDeleteLeadConfirm(false);
    }
  };

  const handleConvertLead = (leadId: string) => {
    setLeadToConvert(leadId);
    setShowConvertLeadConfirm(true);
  };

  const confirmConvertLead = async () => {
    if (leadToConvert) {
      await convertLeadToCustomer(leadToConvert);
      showToast('Lead succesvol geconverteerd naar klant! 🎉', 'success');
      setLeadToConvert(null);
      setShowConvertLeadConfirm(false);
    }
  };

  const handleCreateInteraction = async (data: any) => {
    await createInteraction(data);
    showToast('Interactie succesvol aangemaakt', 'success');
    setShowInteractionModal(false);
    setEditingInteraction(null);
  };

  const handleEditInteraction = (interaction: Interaction) => {
    setEditingInteraction(interaction);
    setShowInteractionModal(true);
  };

  const handleUpdateInteraction = async (data: any) => {
    if (editingInteraction) {
      await updateInteraction(editingInteraction.id, data);
      showToast('Interactie succesvol bijgewerkt', 'success');
      setShowInteractionModal(false);
      setEditingInteraction(null);
    }
  };

  const handleDeleteInteraction = (id: string) => {
    setItemToDelete(id);
    setShowDeleteInteractionConfirm(true);
  };

  const confirmDeleteInteraction = async () => {
    if (itemToDelete) {
      await deleteInteraction(itemToDelete);
      showToast('Interactie verwijderd', 'info');
      setItemToDelete(null);
      setShowDeleteInteractionConfirm(false);
    }
  };

  const handleCreateTask = async (data: any) => {
    await createTask(data);
    showToast('Taak succesvol aangemaakt', 'success');
    setShowTaskModal(false);
    setEditingTask(null);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };

  const handleUpdateTask = async (data: any) => {
    if (editingTask) {
      await updateTask(editingTask.id, data);
      showToast('Taak succesvol bijgewerkt', 'success');
      setShowTaskModal(false);
      setEditingTask(null);
    }
  };

  const handleDeleteTask = (id: string) => {
    setItemToDelete(id);
    setShowDeleteTaskConfirm(true);
  };

  const confirmDeleteTask = async () => {
    if (itemToDelete) {
      await deleteTask(itemToDelete);
      showToast('Taak verwijderd', 'info');
      setItemToDelete(null);
      setShowDeleteTaskConfirm(false);
    }
  };

  const handleToggleTaskStatus = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      const newStatus = task.status === 'done' ? 'todo' : task.status === 'todo' ? 'in_progress' : 'done';
      await updateTask(id, { status: newStatus });
    }
  };

  if (isLoading) {
    return <SkeletonList count={6} showAvatar={true} showActions={true} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">CRM</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Klantrelatiebeheer</p>
        </div>
        <div className="flex gap-2">
          {activeTab === 'customers' && (
            <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => {
              setEditingCustomer(null);
              setShowCustomerModal(true);
            }}>
              Nieuwe Klant
            </Button>
          )}
          {activeTab === 'leads' && (
            <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => {
              setEditingLead(null);
              setShowLeadModal(true);
            }}>
              Nieuwe Lead
            </Button>
          )}
          {activeTab === 'interactions' && (
            <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => {
              setEditingInteraction(null);
              setShowInteractionModal(true);
            }}>
              Nieuwe Interactie
            </Button>
          )}
          {activeTab === 'tasks' && (
            <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => {
              setEditingTask(null);
              setShowTaskModal(true);
            }}>
              Nieuwe Taak
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Totaal Klanten</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{customers.length}</p>
            </div>
            <Users className="h-10 w-10 text-indigo-500" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Actieve Leads</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{activeLeads}</p>
            </div>
            <TrendingUp className="h-10 w-10 text-emerald-500" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Conversiepercentage</p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{conversionRate}%</p>
            </div>
            <TrendingUp className="h-10 w-10 text-emerald-500" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Achterstallige Taken</p>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{overdueTasks}</p>
            </div>
            <CheckSquare className="h-10 w-10 text-amber-500" />
          </div>
        </Card>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveTab('customers')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'customers'
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Klanten ({customers.length})
            </button>
            <button
              onClick={() => setActiveTab('leads')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'leads'
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Leads ({leads.length})
            </button>
            <button
              onClick={() => setActiveTab('interactions')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'interactions'
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Interacties ({interactions.length})
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'tasks'
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Taken ({tasks.length})
            </button>
          </div>
          <div className="flex-1 max-w-md">
            <Input
              placeholder="Zoeken..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
            />
          </div>
        </div>

        {activeTab === 'customers' && (
          <CustomerList
            customers={filteredCustomers}
            onEdit={handleEditCustomer}
            onDelete={handleDeleteCustomer}
          />
        )}

        {activeTab === 'leads' && (
          <LeadPipeline
            leads={filteredLeads}
            onEdit={handleEditLead}
            onDelete={handleDeleteLead}
            onConvert={handleConvertLead}
          />
        )}

        {activeTab === 'interactions' && (
          <InteractionList
            interactions={filteredInteractions}
            onEdit={handleEditInteraction}
            onDelete={handleDeleteInteraction}
          />
        )}

        {activeTab === 'tasks' && (
          <TaskList
            tasks={filteredTasks}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onToggleStatus={handleToggleTaskStatus}
          />
        )}
      </div>

      {/* Modals */}
      <Modal
        isOpen={showCustomerModal}
        onClose={() => {
          setShowCustomerModal(false);
          setEditingCustomer(null);
        }}
        title={editingCustomer ? 'Klant Bewerken' : 'Nieuwe Klant'}
        className="max-w-3xl"
      >
        <CustomerForm
          customer={editingCustomer}
          onSubmit={editingCustomer ? handleUpdateCustomer : handleCreateCustomer}
          onCancel={() => {
            setShowCustomerModal(false);
            setEditingCustomer(null);
          }}
        />
      </Modal>

      <Modal
        isOpen={showLeadModal}
        onClose={() => {
          setShowLeadModal(false);
          setEditingLead(null);
        }}
        title={editingLead ? 'Lead Bewerken' : 'Nieuwe Lead'}
        className="max-w-2xl"
      >
        <LeadForm
          lead={editingLead}
          onSubmit={editingLead ? handleUpdateLead : handleCreateLead}
          onCancel={() => {
            setShowLeadModal(false);
            setEditingLead(null);
          }}
        />
      </Modal>

      <Modal
        isOpen={showInteractionModal}
        onClose={() => {
          setShowInteractionModal(false);
          setEditingInteraction(null);
        }}
        title={editingInteraction ? 'Interactie Bewerken' : 'Nieuwe Interactie'}
        className="max-w-2xl"
      >
        <InteractionForm
          interaction={editingInteraction}
          customers={customers}
          leads={leads}
          onSubmit={editingInteraction ? handleUpdateInteraction : handleCreateInteraction}
          onCancel={() => {
            setShowInteractionModal(false);
            setEditingInteraction(null);
          }}
        />
      </Modal>

      <Modal
        isOpen={showTaskModal}
        onClose={() => {
          setShowTaskModal(false);
          setEditingTask(null);
        }}
        title={editingTask ? 'Taak Bewerken' : 'Nieuwe Taak'}
        className="max-w-2xl"
      >
        <TaskForm
          task={editingTask}
          customers={customers}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          onCancel={() => {
            setShowTaskModal(false);
            setEditingTask(null);
          }}
        />
      </Modal>

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        isOpen={showDeleteCustomerConfirm}
        onClose={() => {
          setShowDeleteCustomerConfirm(false);
          setItemToDelete(null);
        }}
        onConfirm={confirmDeleteCustomer}
        title="Klant Verwijderen"
        message="Weet u zeker dat u deze klant wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt."
        confirmText="Verwijderen"
        cancelText="Annuleren"
        type="danger"
      />

      <ConfirmDialog
        isOpen={showDeleteLeadConfirm}
        onClose={() => {
          setShowDeleteLeadConfirm(false);
          setItemToDelete(null);
        }}
        onConfirm={confirmDeleteLead}
        title="Lead Verwijderen"
        message="Weet u zeker dat u deze lead wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt."
        confirmText="Verwijderen"
        cancelText="Annuleren"
        type="danger"
      />

      <ConfirmDialog
        isOpen={showDeleteInteractionConfirm}
        onClose={() => {
          setShowDeleteInteractionConfirm(false);
          setItemToDelete(null);
        }}
        onConfirm={confirmDeleteInteraction}
        title="Interactie Verwijderen"
        message="Weet u zeker dat u deze interactie wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt."
        confirmText="Verwijderen"
        cancelText="Annuleren"
        type="danger"
      />

      <ConfirmDialog
        isOpen={showDeleteTaskConfirm}
        onClose={() => {
          setShowDeleteTaskConfirm(false);
          setItemToDelete(null);
        }}
        onConfirm={confirmDeleteTask}
        title="Taak Verwijderen"
        message="Weet u zeker dat u deze taak wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt."
        confirmText="Verwijderen"
        cancelText="Annuleren"
        type="danger"
      />

      <ConfirmDialog
        isOpen={showConvertLeadConfirm}
        onClose={() => {
          setShowConvertLeadConfirm(false);
          setLeadToConvert(null);
        }}
        onConfirm={confirmConvertLead}
        title="Lead Converteren"
        message="Weet u zeker dat u deze lead naar een klant wilt converteren?"
        confirmText="Converteren"
        cancelText="Annuleren"
        type="info"
      />
    </div>
  );
};
