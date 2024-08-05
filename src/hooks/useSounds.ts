import useSound from 'use-sound';
import { useAppSettings } from '../context/AppSettingsContext';
import validWordSound from '../assets/valid-word.wav';
import invalidWordSound from '../assets/invalid-word.wav';
import scenarioSuccessSound from '../assets/scenario-success.wav';
import hintRequestedSound from '../assets/hint-requested.wav';
import scenarioCompleteSound from '../assets/scenario-complete.wav';

export type SoundType = 'validWord' | 'invalidWord' | 'scenarioSuccess' | 'hintRequested' | 'scenarioComplete';

const soundFiles: Record<SoundType, string> = {
  validWord: validWordSound,
  invalidWord: invalidWordSound,
  scenarioSuccess: scenarioSuccessSound,
  hintRequested: hintRequestedSound,
  scenarioComplete: scenarioCompleteSound,
};

export const useSounds = () => {
  const { settings } = useAppSettings();
  const [playValidWord, { stop: stopValidWord }] = useSound(soundFiles.validWord);
  const [playInvalidWord, { stop: stopInvalidWord }] = useSound(soundFiles.invalidWord);
  const [playScenarioSuccess, { stop: stopScenarioSuccess }] = useSound(soundFiles.scenarioSuccess);
  const [playHintRequested, { stop: stopHintRequested }] = useSound(soundFiles.hintRequested);
  const [playScenarioComplete, { stop: stopScenarioComplete }] = useSound(soundFiles.scenarioComplete);

  const stopAllSounds = () => {
    stopValidWord();
    stopInvalidWord();
    stopScenarioSuccess();
    stopHintRequested();
    stopScenarioComplete();
  };

  const playSound = (type: SoundType) => {
    if (!settings.isSoundOn) return; // Check if sound is enabled
    stopAllSounds(); // Stop any currently playing sound
    switch (type) {
      case 'validWord':
        playValidWord();
        break;
      case 'invalidWord':
        playInvalidWord();
        break;
      case 'scenarioSuccess':
        playScenarioSuccess();
        break;
      case 'hintRequested':
        playHintRequested();
        break;
      case 'scenarioComplete':
        playScenarioComplete();
        break;
    }
  };

  return { playSound };
};