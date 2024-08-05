tinware/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── assets/
│   │   ├── tinware-logo.svg
│   │   ├── valid-word.wav
│   │   ├── invalid-word.wav
│   │   ├── scenario-success.wav
│   │   ├── scenario-complete.wav
│   │   └── hint-requested.wav
│   ├── components/
│   │   ├── AddOneGame.tsx
│   │   ├── BingoStemGame.tsx
│   │   ├── GameContainer.tsx
│   │   ├── NavBar.tsx
│   │   ├── SelectGame.tsx
│   │   ├── Settings.tsx
│   │   ├── SoundToggle.tsx
│   │   └── PlayGame/
│   │       ├── ControlButtons.tsx
│   │       ├── DisplayArea.tsx
│   │       ├── GamePrompt.tsx
│   │       ├── InputArea.tsx
│   │       ├── MessageArea.tsx
│   │       └── PlayGame.tsx
│   ├── config/
│   │   └── config.ts
│   ├── context/
│   │   ├── GameContext.tsx
│   │   └── AppSettingsContext.tsx
│   ├── hooks/
│   │   ├── useAddOneLogic.ts
│   │   ├── useBingoStemLogic.ts
│   │   ├── useCommonGameLogic.ts
│   │   ├── useGameInput.ts
│   │   └── useSounds.ts
│   ├── services/
│   │   └── DataInitializer.tsx
│   ├── types/
│   │   └── gameTypes.ts
│   ├── utils/
│   │   ├── answerProcessor.ts
│   │   ├── appHelpers.ts
│   │   └── gameUtils.ts
│   ├── App.tsx
│   ├── db.ts
│   ├── index.css
│   └── index.tsx
├── .gitignore
├── package.json
├── README.md
├── tsconfig.json
└── vite.config.ts