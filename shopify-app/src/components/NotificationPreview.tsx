import React from 'react';
import './NotificationPreview.css';

interface NotificationPreviewProps {
  title: string;
  body: string;
}

export const NotificationPreview: React.FC<NotificationPreviewProps> = ({ title, body }) => {
  return (
    <div className="preview-container">
      <div className="phone-screen">
        {/* Fond d'écran minimaliste noir et doré */}
        <div className="phone-wallpaper">
          <div className="wallpaper-gradient" />
          <div className="wallpaper-logo">KEA</div>
        </div>

        {/* Bannière de notification Push animée */}
        <div className="push-banner">
          <div className="push-header">
            <div className="app-icon-placeholder">
              <span className="icon-text">K</span>
            </div>
            <span className="app-name">KEA Shop</span>
            <span className="push-time">à l'instant</span>
          </div>
          <div className="push-body">
            <h4 className="push-title">{title || 'Titre de la notification'}</h4>
            <p className="push-message">{body || 'Entrez votre message à gauche pour voir l\'aperçu...'}</p>
          </div>
          <div className="push-indicator" />
        </div>
      </div>
    </div>
  );
};
