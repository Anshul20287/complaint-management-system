import { mapPins, issueList } from '../../data/mapIssues';
import MapPin   from './MapPin';
import IssueRow from './IssueRow';

/**
 * MapCard — the floating live-city-map card shown in the Hero section.
 */
export default function MapCard() {
  return (
    <div
      className="rounded-2xl p-6 relative animate-float"
      style={{ background: '#0b0f1e', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      {/* Top glow line */}
      <div
        className="absolute top-[-1px] h-[2px]"
        style={{
          left: '20%', right: '20%',
          background: 'linear-gradient(90deg,transparent,#00f5d4,transparent)',
        }}
      />

      <p className="text-[0.7rem] tracking-[2px] text-muted mb-4">LIVE CITY MAP — MUMBAI</p>

      {/* Grid map */}
      <div
        className="relative rounded-xl h-[200px] mb-4 overflow-hidden"
        style={{ background: 'rgba(0,245,212,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        {/* Gridlines */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,245,212,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(0,245,212,0.05) 1px,transparent 1px)',
            backgroundSize: '30px 30px',
          }}
        />
        {/* Pins */}
        {mapPins.map((pin) => (
          <MapPin key={pin.label} {...pin} />
        ))}
      </div>

      {/* Issue list */}
      <div className="flex flex-col gap-2">
        {issueList.map((issue) => (
          <IssueRow key={issue.name} {...issue} />
        ))}
      </div>
    </div>
  );
}
