import React, { useState, useEffect } from 'react';
import { 
  Card, IndexTable, Badge, Button, BlockStack, Text, Spinner 
} from '@shopify/polaris';
import { collection, query, orderBy, limit, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../services/firebase';

interface NotificationHistoryItem {
  id: string;
  title: string;
  body: string;
  target: string;
  status: 'sent' | 'pending' | 'failed';
  scheduledAt?: string;
  sentAt?: string;
}

export const NotificationHistory: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Écouteur en temps réel sur la collection Firestore
    const q = query(
      collection(db, 'scheduled_notifications'), 
      orderBy('createdAt', 'desc'), 
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: NotificationHistoryItem[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as NotificationHistoryItem);
      });
      setNotifications(list);
      setLoading(false);
    }, (error) => {
      console.error('Erreur écoute notifications history:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'scheduled_notifications', id));
      console.log('Notification supprimée de la file d\'attente');
    } catch (error) {
      console.error('Erreur lors de la suppression de la notification :', error);
    }
  };

  const getStatusBadge = (status: 'sent' | 'pending' | 'failed') => {
    switch (status) {
      case 'sent':
        return <Badge tone="success">Envoyée</Badge>;
      case 'pending':
        return <Badge tone="attention">Planifiée</Badge>;
      case 'failed':
        return <Badge tone="critical">Échouée</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const rowMarkup = notifications.map(
    ({ id, title, body, target, status, scheduledAt, sentAt }, index) => {
      const dateToShow = scheduledAt 
        ? new Date(scheduledAt).toLocaleString('fr-FR')
        : (sentAt ? new Date(sentAt).toLocaleString('fr-FR') : '-');

      return (
        <IndexTable.Row id={id} key={id} position={index}>
          <IndexTable.Cell>
            <Text variant="bodyMd" fontWeight="bold" as="span">{title}</Text>
            <div style={{ color: '#6d7175', fontSize: '12px' }}>{body}</div>
          </IndexTable.Cell>
          <IndexTable.Cell>{target.toUpperCase()}</IndexTable.Cell>
          <IndexTable.Cell>{dateToShow}</IndexTable.Cell>
          <IndexTable.Cell>{getStatusBadge(status)}</IndexTable.Cell>
          <IndexTable.Cell>
            {status === 'pending' && (
              <Button size="slim" tone="critical" onClick={() => handleDelete(id)}>
                Annuler
              </Button>
            )}
          </IndexTable.Cell>
        </IndexTable.Row>
      );
    }
  );

  return (
    <Card>
      <BlockStack gap="400">
        <Text variant="headingMd" as="h2">Historique des notifications</Text>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Spinner size="large" />
          </div>
        ) : notifications.length === 0 ? (
          <Text variant="bodyMd" as="p" tone="subdued">
            Aucune notification envoyée ou planifiée pour le moment.
          </Text>
        ) : (
          <IndexTable
            resourceName={{ singular: 'notification', plural: 'notifications' }}
            itemCount={notifications.length}
            headings={[
              { title: 'Message' },
              { title: 'Cible' },
              { title: 'Date' },
              { title: 'Statut' },
              { title: 'Actions' },
            ]}
            selectable={false}
          >
            {rowMarkup}
          </IndexTable>
        )}
      </BlockStack>
    </Card>
  );
};
