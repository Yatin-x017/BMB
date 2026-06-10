import { create } from 'zustand';

const useStore = create((set) => ({
  parties: [
    { id: '1', name: 'Ramesh Gupta',  phone: '9876543210', balance: 4500  },
    { id: '2', name: 'Sunita Devi',   phone: '8765432109', balance: -1200 },
    { id: '3', name: 'Ajay Sharma',   phone: '7654321098', balance: 8000  },
    { id: '4', name: 'Priya Kumari',  phone: '9123456780', balance: 0     },
  ],
  entries: [
    { id: 'e1', party_id: '1', amount: 5000, type: 'udhar',   date: '2026-06-01', note: 'Grocery items' },
    { id: 'e2', party_id: '1', amount: 500,  type: 'payment', date: '2026-06-05', note: '' },
    { id: 'e3', party_id: '2', amount: 2000, type: 'udhar',   date: '2026-06-02', note: 'Medicine' },
    { id: 'e4', party_id: '2', amount: 3200, type: 'payment', date: '2026-06-08', note: 'Partial payment' },
    { id: 'e5', party_id: '3', amount: 8000, type: 'udhar',   date: '2026-06-09', note: 'Cloth' },
  ],

  // Add a new party
  addParty: (party) =>
    set((s) => ({ parties: [...s.parties, party] })),

  // Add an entry and update party balance
  addEntry: (entry) =>
    set((s) => {
      const delta = entry.type === 'udhar' ? entry.amount : -entry.amount;
      const updatedParties = s.parties.map((p) =>
        p.id === entry.party_id ? { ...p, balance: p.balance + delta } : p
      );
      return { entries: [...s.entries, entry], parties: updatedParties };
    }),
}));

export default useStore;
