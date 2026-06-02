import { Typography } from 'antd';
import { motion } from 'framer-motion';

const { Title, Paragraph } = Typography;

export default function Hero() {
  return (
    <div className="hero-section">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title className="hero-title" style={{ fontSize: '3rem' }}>
          AI Cold Email Generator
        </Title>
        <Paragraph className="hero-subtitle">
          Generate highly personalized cold emails from job postings in seconds. 
          Powered by AI, designed for conversion.
        </Paragraph>
      </motion.div>
    </div>
  );
}
