
import React, { useState, useEffect, useCallback } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { AIStudio } from './components/AIStudio';
import { Auth } from './components/Auth';
import { supabase } from './services/supabaseClient';
import { 
  X, 
  Loader2,
  AlertCircle,
  Check,
  Calendar
} from 'lucide-react';
import { 
  Client, 
  Booking, 
  BookingStatus, 
  Task, 
  TaskStatus, 
  TaskType, 
  Package, 
  Employee, 
  UserRole 
} from './types';

// Component: Modal
// Re-defining the Modal component with proper return values to fix potential void return errors.
const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-white/20">
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white">
          <h3 className="font-black text-slate-900 tracking-tight">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-400 hover:text-slate-900 transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-8 max-h-[85vh] overflow-y-auto bg-white">{children}</div>
      </div>
    </div>
  );
};

// Main App Component
// Ensuring the component is typed as React.FC and returns valid JSX to fix the "void" return type error.
const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Data State
  const [clients, setClients] = useState<Client[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  // Modals State
  const [isClientModalOpen, setClientModalOpen] = useState(false);
  const [isBookingModalOpen, setBookingModalOpen] = useState(false);
  
  // Editing state
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  const fetchAllData = useCallback(async () => {
    try {
      const [cRes, bRes, pRes, tRes, eRes] = await Promise.allSettled([
        supabase.from('clients').select('*').order('created_at', { ascending: false }),
        supabase.from('bookings').select('*').order('created_at', { ascending: false }),
        supabase.from('packages').select('*'),
        supabase.from('tasks').select('*'),
        supabase.from('employees').select('*')
      ]);

      const getVal = (res: PromiseSettledResult<any>) => res.status === 'fulfilled' ? res.value.data : [];
      
      setClients(getVal(cRes) || []);
      setBookings(getVal(bRes) || []);
      setPackages(getVal(pRes) || []);
      setTasks(getVal(tRes) || []);
      setEmployees(getVal(eRes) || []);
    } catch (err) {
      console.error("Data fetch error:", err);
    }
  }, []);

  const checkRoleAndInit = useCallback(async (userId: string) => {
    try {
      const { data } = await supabase
        .from('employees')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

      if (data) {
        setIsSuperAdmin(data.role === UserRole.SUPER_ADMIN);
      } else {
        const { count } = await supabase.from('employees').select('*', { count: 'exact', head: true });
        if (count === 0) setIsSuperAdmin(true);
        else setIsSuperAdmin(false);
      }
      await fetchAllData();
    } catch (e) {
      console.error("Initialization error:", e);
      setError("Sync problem detected. Please refresh.");
    } finally {
      setLoading(false);
    }
  }, [fetchAllData]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      if (initialSession?.user) {
        checkRoleAndInit(initialSession.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        setLoading(true);
        await checkRoleAndInit(newSession.user.id);
      } else {
        setIsSuperAdmin(false);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [checkRoleAndInit]);

  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setSession(null);
    setIsSuperAdmin(false);
    setLoading(false);
  };

  const handleSaveClient = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!session?.user) return;
    setSubmitting(true);
    const fd = new FormData(e.currentTarget);
    const clientData = {
      name: fd.get('name') as string,
      email: fd.get('email') as string,
      phone: fd.get('phone') as string,
      address: fd.get('address') as string,
      notes: fd.get('notes') as string,
    };

    try {
      if (editingClient) {
        const { error } = await supabase.from('clients').update(clientData).eq('id', editingClient.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('clients').insert([clientData]);
        if (error) throw error;
      }
      setClientModalOpen(false);
      setEditingClient(null);
      await fetchAllData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveBooking = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    // Logic for saving/updating bookings
    setBookingModalOpen(false);
    setSubmitting(false);
    await fetchAllData();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  if (!session) {
    return <Auth />;
  }

  return (
    <Layout 
      activeTab={activeTab} 
      onTabChange={setActiveTab} 
      onLogout={handleLogout} 
      user={session.user}
      isSuperAdmin={isSuperAdmin}
    >
      {activeTab === 'dashboard' && (
        <Dashboard 
          clients={clients} 
          bookings={bookings} 
          onAddClient={() => { setEditingClient(null); setClientModalOpen(true); }}
          onAddBooking={() => { setEditingBooking(null); setBookingModalOpen(true); }}
          onViewAllClients={() => setActiveTab('clients')}
          onViewSchedule={() => setActiveTab('bookings')}
          onEditClient={(client) => { setEditingClient(client); setClientModalOpen(true); }}
          onEditBooking={(booking) => { setEditingBooking(booking); setBookingModalOpen(true); }}
        />
      )}
      {activeTab === 'ai' && <AIStudio />}
      
      {/* Tab content placeholder for routes not explicitly detailed in snippets */}
      {!['dashboard', 'ai'].includes(activeTab) && (
        <div className="flex flex-col items-center justify-center h-full text-slate-400 min-h-[400px]">
          <Calendar size={48} className="mb-4 opacity-20" />
          <p className="text-sm font-bold uppercase tracking-widest">{activeTab} Section</p>
          <p className="text-xs mt-2">Manage your {activeTab} records here.</p>
        </div>
      )}

      {/* Client Management Modal */}
      <Modal 
        isOpen={isClientModalOpen} 
        onClose={() => { setClientModalOpen(false); setEditingClient(null); }} 
        title={editingClient ? "Edit Client" : "New Client"}
      >
        <form onSubmit={handleSaveClient} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Full Name</label>
            <input name="name" defaultValue={editingClient?.name} required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Email</label>
            <input name="email" type="email" defaultValue={editingClient?.email} required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50" />
          </div>
          <button type="submit" disabled={submitting} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 disabled:opacity-50">
            {submitting ? <Loader2 className="animate-spin" /> : <><Check size={18} /> {editingClient ? 'Update' : 'Create'} Client</>}
          </button>
        </form>
      </Modal>

      {/* Booking Management Modal */}
      <Modal 
        isOpen={isBookingModalOpen} 
        onClose={() => setBookingModalOpen(false)} 
        title="Shoot Information"
      >
        <div className="text-center py-10 text-slate-400">
          <p className="text-sm font-medium">Record project details and schedules.</p>
        </div>
      </Modal>

      {error && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-rose-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 shadow-xl animate-in slide-in-from-bottom-2">
          <AlertCircle size={18} />
          <span className="text-xs font-bold">{error}</span>
          <button onClick={() => setError(null)} className="ml-2 hover:opacity-70"><X size={14} /></button>
        </div>
      )}
    </Layout>
  );
};

export default App;
