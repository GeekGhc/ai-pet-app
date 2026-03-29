import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import styles from './ChatPanel.module.css';

const quickReplies = [
  '鼓励一下我',
  '我累了',
  '我考了好成绩',
  '今天学了什么',
];

export function ChatPanel() {
  const { state, sendMessage } = useApp();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.chatHistory]);

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input.trim());
      setInput('');
    }
  };

  const handleQuickReply = (reply: string) => {
    sendMessage(reply);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.headerIcon}>💬</span>
        <span>与小灵的对话</span>
      </div>
      
      <div className={styles.messages}>
        {state.chatHistory.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>✨</span>
            <p>和小灵聊聊天吧！</p>
          </div>
        ) : (
          <AnimatePresence>
            {state.chatHistory.map((msg) => (
              <motion.div
                key={msg.id}
                className={`${styles.message} ${msg.role === 'pet' ? styles.petMessage : styles.userMessage}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {msg.role === 'pet' && (
                  <span className={styles.avatar}>🐣</span>
                )}
                <div className={styles.bubble}>
                  {msg.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.quickReplies}>
        {quickReplies.map((reply) => (
          <button
            key={reply}
            className={styles.quickButton}
            onClick={() => handleQuickReply(reply)}
          >
            {reply}
          </button>
        ))}
      </div>

      <div className={styles.inputArea}>
        <input
          type="text"
          className={styles.input}
          placeholder="输入消息..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <motion.button
          className={styles.sendButton}
          onClick={handleSend}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          发送
        </motion.button>
      </div>
    </div>
  );
}