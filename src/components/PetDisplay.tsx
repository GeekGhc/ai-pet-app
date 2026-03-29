import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import styles from './PetDisplay.module.css';

export function PetDisplay() {
  const { state } = useApp();
  const pet = state.pet;

  if (!pet) return null;

  const getStageEmoji = (stage: string) => {
    switch (stage) {
      case 'egg': return '🥚';
      case 'baby': return '🐣';
      case 'young': return '🐤';
      case 'adult': return '🦅';
      default: return '🥚';
    }
  };

  const getWingEmoji = (wingType: string) => {
    switch (wingType) {
      case 'rational': return '🧠';
      case 'poetic': return '✍️';
      case 'exploratory': return '🔬';
      case 'social': return '💬';
      default: return '';
    }
  };

  const getExpressionEmoji = (expression: string) => {
    switch (expression) {
      case 'happy': return '😊';
      case 'excited': return '🤩';
      case 'concerned': return '😟';
      case 'encouraging': return '💪';
      case 'calm': return '😌';
      default: return '😊';
    }
  };

  const getStageName = (stage: string) => {
    switch (stage) {
      case 'egg': return '蛋';
      case 'baby': return '幼年期';
      case 'young': return '成长期';
      case 'adult': return '成熟期';
      default: return '蛋';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.stageInfo}>
        <span className={styles.stageBadge}>{getStageName(pet.stage)}</span>
        <span className={styles.level}>Lv.{pet.level}</span>
      </div>
      
      <motion.div
        className={styles.petContainer}
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
      >
        <motion.div
          className={styles.petWrapper}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className={styles.pet}>
            <span className={styles.mainEmoji}>
              {getStageEmoji(pet.stage)}
            </span>
            {pet.appearance.wingType !== 'none' && (
              <span className={styles.wing}>
                {getWingEmoji(pet.appearance.wingType)}
              </span>
            )}
            <motion.span
              className={styles.expression}
              key={pet.appearance.expression}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              {getExpressionEmoji(pet.appearance.expression)}
            </motion.span>
          </div>
          
          {pet.appearance.auraType !== 'none' && (
            <motion.div
              className={styles.aura}
              animate={{ 
                boxShadow: [
                  '0 0 20px rgba(108, 92, 231, 0.5)',
                  '0 0 40px rgba(108, 92, 231, 0.8)',
                  '0 0 20px rgba(108, 92, 231, 0.5)',
                ]
              }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          )}
        </motion.div>
      </motion.div>

      <div className={styles.petName}>{pet.name}</div>
      
      <motion.div 
        className={styles.evolutionProgress}
        initial={{ width: 0 }}
        animate={{ width: `${pet.evolutionEnergy}%` }}
        transition={{ duration: 0.5 }}
      />
      <div className={styles.evolutionLabel}>进化能量: {pet.evolutionEnergy}</div>
    </div>
  );
}