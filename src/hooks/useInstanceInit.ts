import { useEffect, useState } from 'react';
import { discoverBestInstance, discoverBestStreamingInstance, getApiInstance } from '../api/instances';

type Status = 'idle' | 'loading' | 'ready' | 'error';

export function useInstanceInit() {
  const [status, setStatus] = useState<Status>(() => {
    return getApiInstance() ? 'ready' : 'idle';
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'ready') return;
    setStatus('loading');

    Promise.all([
      discoverBestInstance(),
      discoverBestStreamingInstance(),
    ])
      .then(([api, streaming]) => {
        if (!api && !streaming) {
          setError('No TIDAL instances available. Try again later.');
          setStatus('error');
        } else {
          setStatus('ready');
        }
      })
      .catch(() => {
        setError('Failed to connect to TIDAL network.');
        setStatus('error');
      });
  }, [status]);

  const retry = () => {
    setStatus('idle');
    setError(null);
  };

  return { status, error, retry };
}
