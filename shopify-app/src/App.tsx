import { useState } from 'react';
import { AppProvider, Page, Layout, Grid, Tabs } from '@shopify/polaris';
import frTranslations from '@shopify/polaris/locales/fr.json';
import { NotificationForm } from './components/NotificationForm';
import { NotificationPreview } from './components/NotificationPreview';
import { NotificationHistory } from './components/NotificationHistory';
import '@shopify/polaris/build/esm/styles.css';

export default function App() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);

  const tabs = [
    {
      id: 'send',
      content: 'Envoyer une notification',
      panelID: 'send-panel',
    },
    {
      id: 'history',
      content: 'Historique des envois',
      panelID: 'history-panel',
    },
  ];

  return (
    <AppProvider i18n={frTranslations}>
      <Page title="KEA Push Notifications" subtitle="Rédigez, planifiez et gérez les notifications de votre application mobile.">
        <Tabs tabs={tabs} selected={selectedTab} onSelect={setSelectedTab}>
          <div style={{ marginTop: '20px' }}>
            {selectedTab === 0 ? (
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
              </Layout>
            ) : (
              <Layout>
                {/* Section Historique (dans son propre onglet) */}
                <Layout.Section>
                  <NotificationHistory />
                </Layout.Section>
              </Layout>
            )}
          </div>
        </Tabs>
      </Page>
    </AppProvider>
  );
}
