import React, { useState } from 'react';
import { 
  Form, FormLayout, TextField, RadioButton, Select, 
  Checkbox, Button, Banner, Card, BlockStack, InlineStack 
} from '@shopify/polaris';
import { useProducts } from '../hooks/useProducts';
import { useNotifications } from '../hooks/useNotifications';
import type { NotificationPayload } from '../services/api';

interface NotificationFormProps {
  title: string;
  setTitle: (t: string) => void;
  body: string;
  setBody: (b: string) => void;
}

export const NotificationForm: React.FC<NotificationFormProps> = ({
  title, setTitle, body, setBody
}) => {
  const { products, loading: productsLoading } = useProducts();
  const { send, submitting, success, error, clearStatus } = useNotifications();

  // États locaux du formulaire
  const [target, setTarget] = useState<'all' | 'android' | 'ios'>('all');
  const [redirectType, setRedirectType] = useState<'home' | 'product' | 'collection'>('home');
  const [redirectId, setRedirectId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Options pour le sélecteur de redirection
  const redirectOptions = [
    { label: 'Accueil de l\'application', value: 'home' },
    { label: 'Un produit spécifique', value: 'product' },
    { label: 'Une collection', value: 'collection' },
  ];

  // Options pour les produits
  const productOptions = [
    { label: 'Sélectionner un produit...', value: '' },
    ...products.map(p => ({ label: p.title, value: p.id }))
  ];

  const handleSubmit = async () => {
    clearStatus();
    setIsSubmitted(true);
    
    // Validation simple
    if (!title || !body) return;

    let scheduledAt: string | undefined;
    if (isScheduled && scheduledDate && scheduledTime) {
      scheduledAt = new Date(`${scheduledDate}T${scheduledTime}`).toISOString();
    }

    const payload: NotificationPayload = {
      title,
      body,
      target,
      redirectType,
      redirectId: redirectType !== 'home' ? redirectId : undefined,
      imageUrl: imageUrl || undefined,
      scheduledAt,
    };

    const isOk = await send(payload);
    if (isOk) {
      // Réinitialiser les champs au succès
      setTitle('');
      setBody('');
      setRedirectId('');
      setImageUrl('');
      setIsScheduled(false);
      setIsSubmitted(false);
    }
  };

  return (
    <Card>
      <BlockStack gap="500">
        {success && <Banner title="Succès" onDismiss={clearStatus} tone="success"><p>{success}</p></Banner>}
        {error && <Banner title="Erreur" onDismiss={clearStatus} tone="critical"><p>{error}</p></Banner>}

        <Form onSubmit={handleSubmit}>
          <FormLayout>
            <TextField 
              label="Titre de la notification" 
              value={title} 
              onChange={(val) => { setTitle(val); if (isSubmitted) setIsSubmitted(false); }} 
              autoComplete="off" 
              placeholder="ex: 🔥 Vente Flash !" 
              error={isSubmitted && !title ? 'Le titre est requis' : undefined} 
            />
            <TextField 
              label="Message (corps)" 
              value={body} 
              onChange={(val) => { setBody(val); if (isSubmitted) setIsSubmitted(false); }} 
              autoComplete="off" 
              multiline={3} 
              placeholder="ex: Profitez de -20% sur tout la boutique aujourd'hui." 
              error={isSubmitted && !body ? 'Le message est requis' : undefined} 
            />
            
            <BlockStack gap="200">
              <span style={{ fontSize: '13px', fontWeight: 500 }}>Ciblage des appareils</span>
              <InlineStack gap="400">
                <RadioButton label="Tous les clients" checked={target === 'all'} id="all" name="target" onChange={() => setTarget('all')} />
                <RadioButton label="Android" checked={target === 'android'} id="android" name="target" onChange={() => setTarget('android')} />
                <RadioButton label="iOS (Apple)" checked={target === 'ios'} id="ios" name="target" onChange={() => setTarget('ios')} />
              </InlineStack>
            </BlockStack>

            <Select label="Action au clic" options={redirectOptions} value={redirectType} onChange={(val) => setRedirectType(val as any)} />

            {redirectType === 'product' && (
              <Select label="Sélectionner le produit" options={productOptions} value={redirectId} onChange={setRedirectId} disabled={productsLoading} />
            )}

            <TextField label="URL de l'image de la bannière (Optionnel)" value={imageUrl} onChange={setImageUrl} autoComplete="off" placeholder="https://mon-image.png" />

            <Checkbox label="Planifier l'envoi dans le futur" checked={isScheduled} onChange={setIsScheduled} />

            {isScheduled && (
              <FormLayout.Group>
                <TextField label="Date d'envoi" type="date" value={scheduledDate} onChange={setScheduledDate} autoComplete="off" />
                <TextField label="Heure d'envoi" type="time" value={scheduledTime} onChange={setScheduledTime} autoComplete="off" />
              </FormLayout.Group>
            )}

            <Button submit variant="primary" loading={submitting}>
              {isScheduled ? 'Planifier la notification' : 'Envoyer immédiatement'}
            </Button>
          </FormLayout>
        </Form>
      </BlockStack>
    </Card>
  );
};
