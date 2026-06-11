import { create } from 'zustand';
import { supabase } from '../lib/supabase';

const useStore = create((set, get) => ({
  parties:  [],
  entries:  [],
  loading:  false,
  error:    null,

  // ── Fetch all data for the logged-in user ────────────────────────────────
  fetchAll: async () => {
    set({ loading: true, error: null });

    const [
      { data: parties, error: pErr },
      { data: entries, error: eErr },
    ] = await Promise.all([
      supabase.from('parties').select('*').order('name'),
      supabase.from('entries').select('*').order('date', { ascending: false }),
    ]);

    if (pErr || eErr) {
      set({ loading: false, error: (pErr || eErr).message });
      return;
    }

    set({ parties: parties ?? [], entries: entries ?? [], loading: false });
  },

  // ── Add a new party ──────────────────────────────────────────────────────
  addParty: async ({ name, phone }) => {
    const { data, error } = await supabase
      .from('parties')
      .insert([{ name: name.trim(), phone: phone.trim(), balance: 0 }])
      .select()
      .single();

    if (!error) {
      set((s) => ({ parties: [...s.parties, data].sort((a, b) => a.name.localeCompare(b.name)) }));
    }
    return { data, error };
  },

  // ── Add an entry and update the party's running balance ──────────────────
  // Both operations run in parallel; local state only updates if both succeed.
  addEntry: async ({ party_id, amount, type, date, note }) => {
    const delta      = type === 'udhar' ? amount : -amount;
    const party      = get().parties.find((p) => p.id === party_id);
    const newBalance = (party?.balance ?? 0) + delta;

    const [
      { data: entry, error: entryErr },
      { error: balanceErr },
    ] = await Promise.all([
      supabase
        .from('entries')
        .insert([{ party_id, amount, type, date, note: note ?? '' }])
        .select()
        .single(),
      supabase
        .from('parties')
        .update({ balance: newBalance })
        .eq('id', party_id),
    ]);

    const error = entryErr || balanceErr;

    if (!error) {
      set((s) => ({
        entries: [entry, ...s.entries],
        parties: s.parties.map((p) =>
          p.id === party_id ? { ...p, balance: newBalance } : p
        ),
      }));
    }

    return { data: entry, error };
  },

  // ── Clear store on logout ────────────────────────────────────────────────
  reset: () => set({ parties: [], entries: [], loading: false, error: null }),
}));

export default useStore;
