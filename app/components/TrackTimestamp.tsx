'use client';

import { formatRelative } from 'date-fns';
import { enUS } from 'date-fns/locale';

type TrackTimestampProps = {
  date?: {
    uts: string;
  };
  isNowPlaying?: boolean;
};

const formatRelativeLocale = {
  lastWeek: "eeee 'at' h:mm a",
  yesterday: "'Yesterday at' h:mm a",
  today: "'Today at' h:mm a",
  tomorrow: "'Tomorrow at' h:mm a",
  nextWeek: "eeee 'at' h:mm a",
  other: 'MM/dd/yyyy h:mm a',
};

export default function TrackTimestamp({ date, isNowPlaying }: TrackTimestampProps) {
  if (isNowPlaying) return <span>Now Playing</span>;
  
  return date ? (
    <span>
      {formatRelative(new Date(parseInt(date.uts) * 1000), new Date(), {
        locale: {
          ...enUS,
          formatRelative: (token: keyof typeof formatRelativeLocale) => 
            formatRelativeLocale[token],
        },
      })}
    </span>
  ) : null;
} 