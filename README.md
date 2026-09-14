# Granny 2D - Versão Final (PC + Mobile)

🎮 Um jogo de ação e fuga multiplayer com suporte para PC e Mobile!

## 📋 Características

- **Multiplayer em Tempo Real**: Jogue com amigos usando MQTT
- **PC + Mobile**: Compatível com teclado e controles touch
- **Cutscenes Cinemáticas**: Introdução em estilo retro
- **Gameplay Desafiador**: Fuja da avó, colete chaves e peças do carro
- **20 Peças do Carro**: Explore salas e complete o carro para escapar
- **IA da Avó**: Patrulha inteligente e sistema de perseguição
- **Arma Shotgun**: Atire para atordoar a avó temporariamente

## 🚀 Como Jogar

### Jogar Solo
1. Abra `index.html` no navegador
2. Digite seu nickname e escolha uma cor
3. Clique em "🎮 Jogar Solo"
4. Fuja da avó, colete chaves e peças!

### Multiplayer
1. Abra `index.html` no navegador
2. Digite o mesmo código de sala que seus amigos
3. Clique em "Criar Sala" ou "Entrar na Sala"
4. Coopere para escapar!

## 🎮 Controles

### PC
- **Movimento**: Setas do teclado ou WASD
- **Pausa**: Botão ⏸ (canto superior direito)
- **Atirar**: Botão 🎯 (quando tiver shotgun)

### Mobile
- **Movimento**: Botões direcionais na tela
- **Pausa**: Botão ⏸ (canto superior direito)
- **Atirar**: Botão 🎯 (quando tiver shotgun)

## 🗺️ Mapa do Jogo

```
┌─────────────────────────────────────┐
│     SALA INICIAL                    │
│  🔴 Chave Vermelha                  │
│  🟡 Chave Amarela                   │
│  🟣 Chave Roxa                      │
│  🟠 Chave Laranja                   │
└─────────────────────────────────────┘
           ↓ Porta Vermelha
┌─────────────────────────────────────┐
│     GARAGEM DO CARRO                │
│  🚗 Carro                           │
│  ⚙️ Motor (peça)                    │
│  ✨ Vela de Ignição (peça)          │
│  ↓ Escadas para Porão               │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│     PORÃO                           │
│  ⛽ Gasolina (peça)                 │
│  🔫 Shotgun                         │
│  🔵 Chave Azul                      │
│  ↓ Escadas de volta                 │
└─────────────────────────────────────┘
     ↙ Porta Azul    ↘ Porta Verde
┌──────────────────┐  ┌──────────────────┐
│  SALA AZUL       │  │  SALA VERDE      │
│  🛞 Pneu         │  │  🔋 Bateria      │
│  🟢 Chave Verde  │  │  🔑 Chave do Carro│
└──────────────────┘  └──────────────────┘
```

## 🔧 Tecnologias

- **Phaser 3**: Framework de jogos 2D
- **MQTT**: Comunicação multiplayer em tempo real
- **EMQX Broker**: Servidor de mensagens
- **JavaScript Vanilla**: Sem dependências adicionais

## 📦 Instalação

1. Clone ou baixe este repositório
2. Abra `index.html` em qualquer navegador moderno
3. Não precisa de servidor - funciona localmente!

## 🌐 Deploy Online

Para hospedar online:

1. **GitHub Pages**: 
   - Vá para Settings > Pages
   - Escolha branch `main`
   - Acesse `https://seu-usuario.github.io/granny-2d-game`

2. **Netlify**:
   - Conecte seu repositório
   - Deploy automático

3. **Vercel**:
   - Conecte seu repositório
   - Deploy com um clique

## 🎯 Objetivo do Jogo

1. Coleta as **4 chaves coloridas**
2. Abre as **4 portas** correspondentes
3. Coleta as **20 peças do carro** espalhadas pelo mapa
4. Volta ao carro e **escapa!**
5. Cuidado com a avó - fuja ou atire com o shotgun!

## 🏆 Dicas de Gameplay

- 🔫 O shotgun atorda a avó por 3 segundos (use com sabedoria!)
- 🔑 Memorize os locais das chaves
- 👵 A avó patrulha quando não te vê, mas persegue quando fica perto
- 🚗 Coleta as peças prioritariamente (mostram no HUD)
- 🤝 Em multiplayer, trabalhe em equipe!

## 📝 Licença

MIT License - Veja arquivo LICENSE para detalhes

## 👨‍💻 Autor

Criado por: silvalealdiego6-pixel

---

**Divirta-se e boa sorte fugindo da avó!** 🏃‍♂️👵
