"use client";

const FormulaireItem = ({ form, setForm, handleAddItem, setShowForm, options }: any) => (
    <div className="space-y-3 bg-gray-50 p-4 rounded-xl shadow-sm mb-4">
        {options.reparations && (
            <select
                value={form.reparations}
                onChange={e => setForm({ ...form, reparations: e.target.value })}
                className="w-full rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            >
                <option value="">-- Sélectionner une réparation --</option>
                {options.reparations.map((r: string) => (
                    <option key={r} value={r}>{r}</option>
                ))}
            </select>
        )}

        {options.prestataires && (
            <select
                value={form.prestataire}
                onChange={e => setForm({ ...form, prestataire: e.target.value })}
                className="w-full rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            >
                <option value="">-- Sélectionner un prestataire --</option>
                {options.prestataires.map((p: string) => (
                    <option key={p} value={p}>{p}</option>
                ))}
            </select>
        )}

        <input
            type="date"
            value={form.date}
            onChange={e => setForm({ ...form, date: e.target.value })}
            className="w-full rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
        />
        <input
            type="number"
            value={form.km}
            onChange={e => setForm({ ...form, km: Number(e.target.value) })}
            placeholder={options.kmPlaceholder}
            className="w-full rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
        />
        <input
            type="number"
            value={form.montant}
            onChange={(e) => setForm({ ...form, montant: Number(e.target.value) })}
            placeholder="Prix (€)"
            className="w-full rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
        />
        <textarea
            value={form.note}
            onChange={e => setForm({ ...form, note: e.target.value })}
            placeholder="Note (optionnelle)"
            className="w-full rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex gap-2">
            <button
                onClick={(e) => { e.preventDefault(); handleAddItem(); }}
                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
            >
                Valider
            </button>
            <button
                onClick={() => setShowForm(false)}
                className="rounded-lg bg-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-400"
            >
                Annuler
            </button>
        </div>
    </div>
);

export default FormulaireItem;