import { useState } from 'react';
import { apiService } from '../services/api';
import type { NotificationPayload } from '../services/api';

export function useNotifications() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const send = async (payload: NotificationPayload) => {
    setSubmitting(true);
    setSuccess(null);
    setError(null);

    try {
      const response = await apiService.sendNotification(payload);
      if (response.success) {
        setSuccess(response.message);
        setSubmitting(false);
        return true;
      } else {
        throw new Error(response.message || 'Erreur inconnue');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'envoi');
      setSubmitting(false);
      return false;
    }
  };

  const clearStatus = () => {
    setSuccess(null);
    setError(null);
  };

  return { send, submitting, success, error, clearStatus };
}
