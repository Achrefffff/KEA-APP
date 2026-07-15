import { useState } from 'react';
import { AppProvider, Page, Layout, Grid } from '@shopify/polaris';
import frTranslations from '@shopify/polaris/locales/fr.json';
import { NotificationForm } from './components/NotificationForm';
import { NotificationPreview } from './components/NotificationPreview';
import { NotificationHistory } from './components/NotificationHistory';
import '@shopify/polaris/build/esm/styles.css';

export default function App() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  return (
    <AppProvider i18n={frTranslations}>
      <Page title="KEA Push Notifications" subtitle="Rédigez, planifiez et envoyez des notifications push à vos clients.">
        <Layout>
          {/* Grille principale : Formulaire (2/3) + Aperçu Smartphone (1/3) */}
          <Layout.Section>
            <Grid>
              <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 4, lg: 8, xl: 8 }}>
                <NotificationForm 
                  title={title} 
                  setTitle={setTitle} 
                  body={body} 
                  setBody={setBody} 
                />
              </Grid.Cell>
              <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 2, lg: 4, xl: 4 }}>
                <NotificationPreview 
                  title={title} 
                  body={body} 
                />
              </Grid.Cell>
            </Grid>
          </Layout.Section>

          {/* Section Historique (en dessous, pleine largeur) */}
          <Layout.Section>
            <NotificationHistory />
          </Layout.Section>
        </Layout>
      </Page>
    </AppProvider>
  );
}
