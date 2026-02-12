import React, { useState, useEffect, useCallback } from 'react';
import { Layout } from './components/Layout.tsx';
import { Dashboard } from './components/Dashboard.tsx';
import { AIStudio } from './components/AIStudio.tsx';
import { Auth } from './components/Auth.tsx';
import { supabase } from './services/supabaseClient.ts';
import { 
  X, 
  Loader2,
  AlertCircle,
  Check,
  Calendar,
  RefreshCcw
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
} from './types.ts';

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

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [clients, setClients] = useState<Client[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  const [isClientModalOpen, setClientModalOpen] = useState(false);
  const [isBookingModalOpen, setBookingModalOpen] = useState(false);
  
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  const fetchAllData = useCallback(async () => {
    try {
      console.log("Fetching studio data...");
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
      console.log("Data sync complete.");
    } catch (err) {
      console.error("Data fetch error:", err);
    }
  }, []);

  const checkRoleAndInit = useCallback(async (userId: string) => {
    try {
      console.log("Checking user role for:", userId);
      const { data, error: roleError } = await supabase
        .from('employees')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

      if (roleError) console.warn("Role check error:", roleError);

      if (data) {
        setIsSuperAdmin(data.role === UserRole.SUPER_ADMIN);
      } else {
        const { count, error: countError } = await supabase.from('employees').select('*', { count: 'exact', head: true });
        if (!countError && count === 0) {
          console.log("First user detected, granting Super Admin");
          setIsSuperAdmin(true);
        } else {
          setIsSuperAdmin(false);
        }
      }
      await fetchAllData();
    } catch (e) {
      console.error("Initialization error:", e);
      setError("Synchronization issue. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }, [fetchAllData]);

  useEffect(() => {
    let mounted = true;

    // Safety timeout: 20s to prevent stuck loaders
    const timeout = setTimeout(() => {
      if (mounted && loading) {
        console.warn("Safety timeout reached. Forcing loading state to end.");
        setLoading(false);
      }
    }, 20000);

    // Initial check + Listener setup
    const initializeAuth = async () => {
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      
      if (!mounted) return;

      if (initialSession) {
        setSession(initialSession);
        await checkRoleAndInit(initialSession.user.id);
      } else {
        setLoading(false);
      }

      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
        if (!mounted) return;
        
        console.log("Auth event:", event);
        setSession(currentSession);
        
        if (currentSession?.user) {
          setLoading(true);
          await checkRoleAndInit(currentSession.user.id);
        } else {
          setIsSuperAdmin(false);
          setLoading(false);
        }
      });

      return subscription;
    };

    const authSub = initializeAuth();

    return () => {
      mounted = false;
      clearTimeout(timeout);
      authSub.then(sub => sub?.unsubscribe());
    };
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <Loader2 className="animate-spin text-indigo-600 mb-6" size={48} strokeWidth={3} />
        <h2 className="text-slate-900 font-black text-xl mb-2 tracking-tight">Syncing Studio Data</h2>
        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] max-w-xs leading-loose">
          Securely connecting to your photographic database...
        </p>
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
      
      {!['dashboard', 'ai'].includes(activeTab) && (
        <div className="flex flex-col items-center justify-center h-full text-slate-400 min-h-[400px]">
          <Calendar size={48} className="mb-4 opacity-20" />
          <p className="text-sm font-bold uppercase tracking-widest">{activeTab} Section</p>
          <p className="text-xs mt-2">Manage your {activeTab} records here.</p>
        </div>
      )}

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
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-rose-600 text-white px-6 py-4 rounded-[2rem] flex items-center gap-4 shadow-2xl animate-in slide-in-from-bottom-2 z-50 border border-rose-500/50">
          <AlertCircle size={24} className="shrink-0" />
          <div>
            <p className="text-xs font-black uppercase tracking-widest leading-none mb-1">System Notice</p>
            <p className="text-xs font-bold opacity-90">{error}</p>
          </div>
          <button onClick={() => window.location.reload()} className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors">
            <RefreshCcw size={16} />
          </button>
          <button onClick={() => setError(null)} className="ml-2 hover:opacity-70"><X size={18} /></button>
        </div>
      )}
    </Layout>
  );
};

export default App;