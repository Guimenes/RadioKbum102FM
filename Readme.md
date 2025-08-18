# Rádio Kbum 102.7 FM - Configuração para Produção

## 📱 Preparação dos Assets

### Ícones Necessários

1. **Ícone Principal (icon.png)**
   - Tamanho: 1024x1024 pixels
   - Formato: PNG
   - Localização: `./assets/icon.png`
   - Use o logo da rádio com fundo laranja (#FF6B35)

2. **Ícone Adaptativo Android (adaptive-icon.png)**
   - Tamanho: 1024x1024 pixels
   - Formato: PNG
   - Localização: `./assets/adaptive-icon.png`
   - Apenas o logo sem fundo (para usar com backgroundColor)

3. **Splash Screen (splash.png)**
   - Tamanho: 1284x2778 pixels (ou 2048x2732 para tablet)
   - Formato: PNG
   - Localização: `./assets/splash.png`
   - Logo centralizado com fundo laranja

4. **Favicon (favicon.png)**
   - Tamanho: 48x48 pixels
   - Formato: PNG
   - Localização: `./assets/favicon.png`

## 🎨 Cores da Marca

- **Laranja Principal**: #FF6B35
- **Dourado**: #FFD700
- **Branco**: #FFFFFF
- **Texto Escuro**: #333333

## 🚀 Build para Produção

### 1. Configurar EAS CLI

```bash
npm install -g @expo/eas-cli
eas login
eas build:configure
```

### 2. Build para Android

```bash
# Preview (APK)
eas build --platform android --profile preview

# Produção (AAB para Google Play)
eas build --platform android --profile production
```

### 3. Build para iOS

```bash
# Preview
eas build --platform ios --profile preview

# Produção (para App Store)
eas build --platform ios --profile production
```

## 📋 Checklist para Produção

- [ ] Substituir todos os assets (icon.png, splash.png, etc.)
- [ ] Configurar URL correta do stream de rádio
- [ ] Testar em dispositivos físicos
- [ ] Verificar permissões de áudio
- [ ] Testar reprodução em background
- [ ] Configurar deep links (se necessário)
- [ ] Configurar analytics (se necessário)
- [ ] Testar media center/notificações
- [ ] Configurar políticas de privacidade

## 🎵 Configurações de Áudio

O app está configurado para:

- Reprodução em background
- Controles no centro de mídia
- Reconexão automática
- Buffer otimizado para streaming
- Suporte a Bluetooth/AirPlay

## 📱 Media Center

O app aparecerá no centro de mídia com:

- Logo da rádio
- Nome: "Rádio Kbum 102.7 FM"
- Status: "🔴 AO VIVO" quando tocando
- Controles: Play, Pause, Stop

## 🔧 Configurações Avançadas

### Package Names

- Android: `com.radiokbum102fm.app`
- iOS: `com.radiokbum102fm.app`

### Versioning

- Version: 1.0.0
- Android versionCode: 1
- iOS buildNumber: 1

### Permissões

- Internet
- Áudio em background
- Controle de volume
- Acesso à rede

## 📦 Deploy

### Google Play Store

1. Gerar AAB com `eas build --platform android --profile production`
2. Upload na Google Play Console
3. Configurar store listing
4. Submeter para revisão

### Apple App Store

1. Gerar IPA com `eas build --platform ios --profile production`
2. Upload no App Store Connect
3. Configurar app information
4. Submeter para revisão

## 🐛 Troubleshooting

### Stream não carrega

- Verificar URL do stream
- Testar conectividade
- Verificar permissões de rede

### Não reproduz em background

- Verificar configuração UIBackgroundModes
- Testar permissões de áudio
- Verificar configuração do TrackPlayer

### Media center não aparece

- Verificar configuração de notificações
- Testar em dispositivo físico
- Verificar metadados do track
