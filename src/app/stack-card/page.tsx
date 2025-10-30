import { mockUser, mockTools } from "@/lib/mock-data";
import { Icon } from "@iconify/react";

const mostUsed = mockTools.find((t) => t.slug === "react");
const db = mockTools.find((t) => t.slug === "prisma");
const recent = mockTools.find((t) => t.slug === "tailwindcss");
const topLangs = [
  mockTools.find((t) => t.slug === "typescript"),
  mockTools.find((t) => t.slug === "golang"),
  mockTools.find((t) => t.slug === "python"),
];

export default function StackCardPage() {
  return (
    <div className="flex flex-col min-h-[90vh] items-center justify-center bg-gradient-to-br from-[var(--surface)] to-[#00FFD011] pb-24">
      <div className="mx-auto mt-8 max-w-lg w-full flex flex-col items-center">
        <div className="relative rounded-3xl border-4 border-[var(--primary)] bg-gradient-to-br from-black/90 via-zinc-950/90 to-[#00FFD022] p-10 shadow-2xl w-full flex flex-col items-center">
          {/* Avatar and name */}
          <div className="flex flex-col items-center mb-10">
            <img src={mockUser.avatarUrl} alt="avatar" width={86} height={86} className="rounded-full border-4 border-[var(--primary)] shadow-lg" />
            <div className="font-bold text-3xl tracking-tight text-[var(--primary)] mt-3">{mockUser.displayName} <span className="text-lg text-zinc-400 ml-1">@{mockUser.username}</span></div>
            <div className="text-[var(--text-muted)] font-serif text-base">{mockUser.bio}</div>
          </div>
          {/* Stack breakdown grid */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="flex flex-col items-center justify-center">
              <div className="text-xs font-medium text-[var(--text-muted)] mb-2">Most used this year</div>
              <div className="rounded-2xl p-5 shadow-md border border-[var(--border)]" style={{background: (mostUsed?.color || '#000') + '11'}}>
                <Icon icon={mostUsed?.icon ?? 'simple-icons:nextdotjs'} width={60} height={60} style={{color: mostUsed?.color}} />
              </div>
              <div className="mt-3 text-lg font-semibold" style={{color: mostUsed?.color}}>{mostUsed?.name}</div>
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className="text-xs font-medium text-[var(--text-muted)] mb-2">Star database</div>
              <div className="rounded-2xl p-5 shadow-md border border-[var(--border)]" style={{background: (db?.color || '#000') + '11'}}>
                <Icon icon={db?.icon ?? 'simple-icons:prisma'} width={60} height={60} style={{color: db?.color}} />
              </div>
              <div className="mt-3 text-lg font-semibold" style={{color: db?.color}}>{db?.name}</div>
            </div>
          </div>
          {/* Top languages */}
          <div className="w-full mb-8">
            <div className="text-xs font-medium text-[var(--text-muted)] mb-3 text-center">Top Languages</div>
            <div className="flex items-center justify-center gap-8">
              {topLangs.map((lang) => lang && (
                <div key={lang.slug} className="flex flex-col items-center">
                  <span className="rounded-xl h-12 w-12 flex items-center justify-center border border-[var(--border)] mb-1" style={{background: (lang.color || '#fff') + '17'}}>
                    <Icon icon={lang.icon} width={36} height={36} style={{color: lang.color}} />
                  </span>
                  <span className="text-xs font-semibold tracking-tight" style={{color: lang.color}}>{lang.name}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Extra badges/stats */}
          <div className="flex gap-6 items-center my-5 pb-4">
            <span className="text-lg text-[var(--primary)] font-bold">{mockUser.stats.toolsLogged} tools</span>
            <span className="text-base text-[var(--text-muted)]">{mockUser.stats.projects} projects</span>
            <span className="text-base text-[var(--text-muted)]">{mockUser.stats.followers} followers</span>
          </div>
          <button className="w-full mt-6 rounded-full bg-[var(--primary)] px-8 py-3 text-lg font-extrabold text-black shadow-[0_0_12px_#00FF8Fcc] focus:outline-none hover:scale-105 hover:shadow-[0_0_32px_#00FF8Fa0] transition">
            Share This Stack Card
          </button>
        </div>
      </div>
    </div>
  );
}


