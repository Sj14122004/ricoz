import { HeartPulse } from 'lucide-react';
import { EMERGENCY_NUMBER } from '@/lib/constants';

export default function SafetyNotice() {
  return (
    <aside className="flex gap-3 rounded-2xl bg-danger/10 p-4 text-sm text-ink ring-1 ring-danger/20" role="note">
      <HeartPulse className="mt-0.5 h-5 w-5 shrink-0 text-danger" aria-hidden />
      <p>
        <strong>This service delivers supplies. It does not give medical advice.</strong> If your baby has trouble
        breathing, a high fever, will not wake, or seems very unwell, call <strong>{EMERGENCY_NUMBER}</strong> or go to the
        nearest hospital now. Ask your pediatrician before giving formula, drops or gripe water.
      </p>
    </aside>
  );
}
