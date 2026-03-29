import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import styles from './StatsPanel.module.css';

const statConfig = {
  rational: { label: '理性值', icon: '🧠', color: '#74b9ff', desc: '数学学习' },
  poetic: { label: '诗意值', icon: '✍️', color: '#fd79a8', desc: '语文学习' },
  exploratory: { label: '探索值', icon: '🔬', color: '#55efc4', desc: '科学学习' },
  social: { label: '社交值', icon: '💬', color: '#ffeaa7', desc: '英语学习' },
};

export function StatsPanel() {
  const { state, completeTask } = useApp();
  const stats = state.pet?.stats;

  if (!stats) return null;

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>属性面板</h3>
      
      <div className={styles.statsGrid}>
        {(Object.keys(statConfig) as Array<keyof typeof statConfig>).map((key) => {
          const config = statConfig[key];
          const value = stats[key];
          
          return (
            <motion.div
              key={key}
              className={styles.statCard}
              whileHover={{ scale: 1.02 }}
            >
              <div className={styles.statHeader}>
                <span className={styles.statIcon}>{config.icon}</span>
                <span className={styles.statLabel}>{config.label}</span>
              </div>
              
              <div className={styles.progressBar}>
                <motion.div
                  className={styles.progressFill}
                  initial={{ width: 0 }}
                  animate={{ width: `${value}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  style={{ background: config.color }}
                />
              </div>
              
              <div className={styles.statValue}>
                <span className={styles.valueNumber}>{value}</span>
                <span className={styles.valueMax}>/100</span>
              </div>
              
              <div className={styles.statDesc}>{config.desc}</div>
            </motion.div>
          );
        })}
      </div>
      
      <div className={styles.tasksSection}>
        <h3 className={styles.subtitle}>每日任务</h3>
        <div className={styles.taskList}>
          {state.tasks.map((task) => (
            <motion.button
              key={task.id}
              className={`${styles.taskButton} ${task.completed ? styles.completed : ''}`}
              onClick={() => !task.completed && completeTask(task.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={task.completed}
            >
              <span className={styles.taskIcon}>
                {task.type === 'math' && '🔢'}
                {task.type === 'chinese' && '📝'}
                {task.type === 'science' && '🧪'}
                {task.type === 'english' && '🗣️'}
              </span>
              <div className={styles.taskInfo}>
                <span className={styles.taskTitle}>{task.title}</span>
                <span className={styles.taskReward}>+{task.reward} {statConfig[task.rewardType].label}</span>
              </div>
              {task.completed && <span className={styles.checkmark}>✓</span>}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}