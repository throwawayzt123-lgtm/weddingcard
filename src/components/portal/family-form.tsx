"use client";

import { useState, useTransition } from "react";
import { Reorder, useDragControls } from "framer-motion";
import { ArrowDown, ArrowUp, GripVertical, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { saveFamilyAction } from "@/app/portal/actions";
import { Card, Field } from "@/components/ui/form";

type Member = { key: string; name: string; phone: string; showPhone: boolean };
type Side = { parentsLine: string; members: Member[] };

let counter = 0;
const newKey = () => `m${Date.now().toString(36)}${counter++}`;

function MemberRow({
  member, index, total, disabled, onChange, onRemove, onMove,
}: {
  member: Member;
  index: number;
  total: number;
  disabled: boolean;
  onChange: (patch: Partial<Member>) => void;
  onRemove: () => void;
  onMove: (dir: -1 | 1) => void;
}) {
  const controls = useDragControls();
  return (
    <Reorder.Item value={member} dragListener={false} dragControls={controls} className="rounded-2xl border border-ink/10 bg-white p-3 shadow-sm" whileDrag={{ scale: 1.02, boxShadow: "0 12px 30px rgba(0,0,0,.18)" }}>
      <div className="flex items-start gap-2">
        <button type="button" aria-label="Drag to reorder" disabled={disabled} className="mt-2 flex size-9 shrink-0 cursor-grab touch-none items-center justify-center rounded-lg text-ink/40 hover:bg-ink/5 active:cursor-grabbing" onPointerDown={(e) => controls.start(e)}>
          <GripVertical className="size-5" />
        </button>
        <div className="grid min-w-0 flex-1 gap-2 sm:grid-cols-2">
          <input aria-label="Name" placeholder="Name, e.g. Hamza Mehmood" value={member.name} disabled={disabled} onChange={(e) => onChange({ name: e.target.value })} className="input !py-2.5" maxLength={60} />
          <input aria-label="Phone number (optional)" placeholder="Phone (optional)" inputMode="tel" value={member.phone} disabled={disabled} onChange={(e) => onChange({ phone: e.target.value })} className="input !py-2.5" maxLength={25} />
          <label className="flex min-h-10 items-center gap-2.5 text-sm sm:col-span-2">
            <input type="checkbox" checked={member.showPhone && !!member.phone} disabled={disabled || !member.phone} onChange={(e) => onChange({ showPhone: e.target.checked })} className="size-5 accent-maroon" />
            Show this phone number on the card
          </label>
        </div>
        <div className="flex shrink-0 flex-col gap-1">
          <button type="button" aria-label="Move up" disabled={disabled || index === 0} onClick={() => onMove(-1)} className="flex size-8 items-center justify-center rounded-lg text-ink/50 hover:bg-ink/5 disabled:opacity-25"><ArrowUp className="size-4" /></button>
          <button type="button" aria-label="Move down" disabled={disabled || index === total - 1} onClick={() => onMove(1)} className="flex size-8 items-center justify-center rounded-lg text-ink/50 hover:bg-ink/5 disabled:opacity-25"><ArrowDown className="size-4" /></button>
          <button type="button" aria-label="Remove" disabled={disabled} onClick={onRemove} className="flex size-8 items-center justify-center rounded-lg text-red-600 hover:bg-red-50"><Trash2 className="size-4" /></button>
        </div>
      </div>
    </Reorder.Item>
  );
}

function SideEditor({ title, hint, side, onChange, disabled }: { title: string; hint: string; side: Side; onChange: (s: Side) => void; disabled: boolean }) {
  const update = (key: string, patch: Partial<Member>) => onChange({ ...side, members: side.members.map((m) => (m.key === key ? { ...m, ...patch } : m)) });
  const move = (i: number, dir: -1 | 1) => {
    const next = [...side.members];
    [next[i], next[i + dir]] = [next[i + dir], next[i]];
    onChange({ ...side, members: next });
  };
  return (
    <Card title={title} description={hint}>
      <Field label="Parents" htmlFor={`parents-${title}`} hint="Written exactly as it should appear, e.g. Mr. & Mrs. Khalid Mehmood">
        <input id={`parents-${title}`} value={side.parentsLine} disabled={disabled} onChange={(e) => onChange({ ...side, parentsLine: e.target.value })} className="input" maxLength={120} />
      </Field>
      <p className="mt-5 mb-2 text-sm font-semibold">Family members <span className="font-normal text-ink/55">(drag the handle to change the order)</span></p>
      {side.members.length === 0 && <p className="rounded-xl bg-cream/60 p-4 text-center text-sm text-ink/60">No one added yet.</p>}
      <Reorder.Group axis="y" values={side.members} onReorder={(members) => onChange({ ...side, members })} className="space-y-2.5">
        {side.members.map((m, i) => (
          <MemberRow key={m.key} member={m} index={i} total={side.members.length} disabled={disabled} onChange={(patch) => update(m.key, patch)} onRemove={() => onChange({ ...side, members: side.members.filter((x) => x.key !== m.key) })} onMove={(d) => move(i, d)} />
        ))}
      </Reorder.Group>
      <button type="button" disabled={disabled || side.members.length >= 12} onClick={() => onChange({ ...side, members: [...side.members, { key: newKey(), name: "", phone: "", showPhone: false }] })} className="btn-secondary mt-4">
        <Plus className="size-5" /> Add a person
      </button>
    </Card>
  );
}

export function FamilyForm({ invitationId, initial, disabled }: { invitationId: string; initial: { groom: Omit<Side, "members"> & { members: Omit<Member, "key">[] }; bride: Omit<Side, "members"> & { members: Omit<Member, "key">[] } }; disabled: boolean }) {
  const withKeys = (s: typeof initial.groom): Side => ({ parentsLine: s.parentsLine, members: s.members.map((m) => ({ ...m, key: newKey() })) });
  const [groom, setGroom] = useState<Side>(() => withKeys(initial.groom));
  const [bride, setBride] = useState<Side>(() => withKeys(initial.bride));
  const [pending, startTransition] = useTransition();

  function save() {
    const strip = (s: Side) => ({ parentsLine: s.parentsLine, members: s.members.filter((m) => m.name.trim()).map((m) => ({ name: m.name, phone: m.phone, showPhone: m.showPhone && !!m.phone })) });
    startTransition(async () => {
      const result = await saveFamilyAction(invitationId, { groom: strip(groom), bride: strip(bride) });
      if (result?.ok) toast.success("Family details saved");
      else toast.error(result ? result.error : "Something went wrong");
    });
  }

  return (
    <div className="space-y-6">
      <SideEditor title="Groom's side" hint="Shown on the left of the “With the blessings of” section." side={groom} onChange={setGroom} disabled={disabled} />
      <SideEditor title="Bride's side" hint="Shown on the right (below on phones)." side={bride} onChange={setBride} disabled={disabled} />
      <button type="button" onClick={save} disabled={pending || disabled} className="btn-primary w-full sm:w-auto">
        {pending && <Loader2 className="size-5 animate-spin" />}
        {pending ? "Saving…" : "Save family details"}
      </button>
    </div>
  );
}
