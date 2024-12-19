'use client';

import { formatRelative } from 'date-fns';

type TrackTimestampProps = {
  date?: {
    uts: string;
  };
  isNowPlaying?: boolean;
};

export default function TrackTimestamp({ date, isNowPlaying }: TrackTimestampProps) {
  if (isNowPlaying) return <span>Now Playing</span>;
  
  return date ? (
    <span>
      {formatRelative(new Date(parseInt(date.uts) * 1000), new Date())}
    </span>
  ) : null;
} 