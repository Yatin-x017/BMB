import { create } from 'zustand';
import { supabase } from '../lib/supabase';

const useStore = create((set, get) => ({
  parties:  [],
  entries:  [],
  loading:  false,
  error:    null,

  // ── Fetch all store data (shared across all employees) ───────────────────
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

  // ── Add a new customer ───────────────────────────────────────────────────
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

  // ── Delete a customer and all their entries ──────────────────────────────
  deleteParty: async (partyId) => {
    const [
      { error: eErr },
      { error: pErr },
    ] = await Promise.all([
      supabase.from('entries').delete().eq('party_id', partyId),
      supabase.from('parties').delete().eq('id', partyId),
    ]);

    const error = eErr || pErr;
    if (!error) {
      set((s) => ({
        parties: s.parties.filter((p) => p.id !== partyId),
        entries: s.entries.filter((e) => e.party_id !== partyId),
      }));
    }
    return { error };
  },

  // ── Add an entry and update the party's running balance ──────────────────
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

  // ── Delete an entry and revert the party's balance ───────────────────────
  deleteEntry: async (entryId) => {
    const entry  = get().entries.find((e) => e.id === entryId);
    if (!entry) return { error: new Error('Entry not found') };

    const delta      = entry.type === 'udhar' ? -entry.amount : entry.amount;
    const party      = get().parties.find((p) => p.id === entry.party_id);
    const newBalance = (party?.balance ?? 0) + delta;

    const [
      { error: delErr },
      { error: balErr },
    ] = await Promise.all([
      supabase.from('entries').delete().eq('id', entryId),
      supabase.from('parties').update({ balance: newBalance }).eq('id', entry.party_id),
    ]);

    const error = delErr || balErr;

    if (!error) {
      set((s) => ({
        entries: s.entries.filter((e) => e.id !== entryId),
        parties: s.parties.map((p) =>
          p.id === entry.party_id ? { ...p, balance: newBalance } : p
        ),
      }));
    }

    return { error };
  },

  // ── Clear store on logout ────────────────────────────────────────────────
  reset: () => set({ parties: [], entries: [], loading: false, error: null }),
}));

export default useStore;
