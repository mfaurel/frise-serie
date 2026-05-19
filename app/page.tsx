import ClientShell from '@/components/ClientShell';
import BackgroundLayer from '@/components/BackgroundLayer';
import TimelineSkeleton from '@/components/TimelineSkeleton';

export default function Page() {
  return (
    <div className="flex flex-col h-screen bg-stone-950 overflow-hidden">
      <TimelineSkeleton />
      {/* TODO(Phase 7): replace locale="fr" with locale from [locale] route params */}
      <ClientShell backgroundLayer={<BackgroundLayer locale="fr" />} />
    </div>
  );
}
