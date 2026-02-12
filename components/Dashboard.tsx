
import React from 'react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar, 
  DollarSign, 
  CheckCircle,
  Plus,
  CreditCard,
  Edit2,
  Sparkles,
  Camera
} from 'lucide-react';
import { Client, Booking, BookingStatus } from '../types';

const chartData = [
  { name: 'Jan', revenue: 4000 },
  { name: 'Feb', revenue: 3000 },
  { name: 'Mar', revenue: 5000 },
  { name: 'Apr', revenue: 4780 },
  { name: 'May', revenue: 6890 },
  { name: 'Jun', revenue: 7390 },
  { name: 'Jul', revenue: 9490 },
];

const MetricCard: React.FC<{ 
  title: string; 
  value: string; 
  change: string; 
  trend: 'up' | 'down'; 
  icon: React.ReactNode;
  color: string;
}> = ({ title, value, change, trend, icon, color }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl ${color}`}>
        {icon}
      </div>
      <div className={`flex items-center gap-1 text-xs font-bold ${trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
        {change}
        {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
      </div>
    </div>
    <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{title}</h3>
    <p className="text-2xl font-black text-slate-900">{value}</p>
  </div>
);

export const Dashboard: React.FC<{
  clients: Client[];
  bookings: Booking[];
  onAddClient: () => void;
  onAddBooking: () => void;
  onViewAllClients: () => void;
  onViewSchedule: () => void;
  onEditClient: (client: Client) => void;
  onEditBooking: (booking: Booking) => void;
}> = ({ clients, bookings, onAddClient, onAddBooking, onViewAllClients, onViewSchedule, onEditClient, onEditBooking }) => {
  const upcomingBookings = [...bookings].filter(b => new Date(b.event_date) >= new Date()).sort((a,b) => a.event_date.localeCompare(b.event_date)).slice(0, 4);

  const totalRevenue = bookings.reduce((sum, b) => sum + b.total_amount, 0);
  const pendingPayments = bookings.reduce((sum, b) => sum + (b.total_amount - b.advance_paid), 0);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Cinematic Hero Section */}
      <div className="relative overflow-hidden rounded-[3rem] bg-slate-900 h-64 md:h-80 shadow-2xl shadow-indigo-200/50">
        <img 
          src="https://images.unsplash.com/photo-1492691523567-6170c2405df1?auto=format&fit=crop&q=80&w=2070" 
          alt="Photography Studio" 
          className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
        <div className="relative h-full flex flex-col justify-end p-8 md:p-12">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="text-indigo-400" size={18} />
            <span className="text-indigo-300 text-[10px] font-black uppercase tracking-[0.3em]">{getGreeting()}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-6">
            Capturing the <span className="text-indigo-400">Extraordinary.</span>
          </h1>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={onAddBooking}
              className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-indigo-900/40 flex items-center gap-2 active:scale-95"
            >
              <Calendar size={18} /> New Shoot
            </button>
            <button 
              onClick={onAddClient}
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 active:scale-95"
            >
              <Plus size={18} /> Add Client
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Total Projects" 
          value={bookings.length.toString()} 
          change="+12.5%" 
          trend="up" 
          icon={<Camera className="text-indigo-600" size={20} />} 
          color="bg-indigo-50"
        />
        <MetricCard 
          title="Gross Revenue" 
          value={`$${totalRevenue.toLocaleString()}`} 
          change="+18.2%" 
          trend="up" 
          icon={<DollarSign className="text-emerald-600" size={20} />} 
          color="bg-emerald-50"
        />
        <MetricCard 
          title="Outstanding" 
          value={`$${pendingPayments.toLocaleString()}`} 
          change="-2.4%" 
          trend="down" 
          icon={<CreditCard className="text-amber-600" size={20} />} 
          color="bg-amber-50"
        />
        <MetricCard 
          title="Success Rate" 
          value="94%" 
          change="+5.1%" 
          trend="up" 
          icon={<CheckCircle className="text-sky-600" size={20} />} 
          color="bg-sky-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="font-black text-slate-900 text-lg">Studio Growth</h3>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Monthly Revenue Streams</p>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 'bold'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 'bold'}} />
                <Tooltip 
                  contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', padding: '15px'}} 
                />
                <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <h3 className="font-black text-slate-900 text-lg mb-8">Production Line</h3>
          <div className="space-y-6">
            {upcomingBookings.length > 0 ? upcomingBookings.map((booking) => {
              const date = new Date(booking.event_date);
              const month = date.toLocaleString('default', { month: 'short' });
              const day = date.getDate();
              return (
                <div 
                  key={booking.id} 
                  className="flex gap-5 items-center group cursor-pointer hover:bg-slate-50 p-3 -m-3 rounded-2xl transition-all"
                  onClick={() => onEditBooking(booking)}
                >
                  <div className="bg-indigo-600 text-white w-14 h-14 rounded-2xl flex flex-col items-center justify-center shadow-lg shadow-indigo-100">
                    <p className="text-[9px] font-black uppercase leading-none mb-1 opacity-80">{month}</p>
                    <p className="text-xl font-black leading-none">{day}</p>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-slate-900 text-sm truncate">{booking.event_type}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider truncate mt-0.5">{booking.location}</p>
                  </div>
                  <Edit2 size={14} className="text-slate-300 group-hover:text-indigo-600 transition-colors" />
                </div>
              );
            }) : (
              <div className="py-20 text-center text-slate-300">
                <Calendar className="mx-auto mb-4 opacity-20" size={48} />
                <p className="text-sm font-bold">Clear schedule</p>
              </div>
            )}
          </div>
          <button 
            onClick={onViewSchedule}
            className="w-full mt-10 py-4 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-900 text-[10px] font-black uppercase tracking-[0.2em] transition-all"
          >
            Manage Timeline
          </button>
        </div>
      </div>
    </div>
  );
};
