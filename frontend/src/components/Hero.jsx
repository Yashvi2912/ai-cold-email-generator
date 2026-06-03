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
          Turn job postings into winning cold emails in one click.
          AI-powered email generation tailored to every opportunity.
        </Paragraph>
      </motion.div>
    </div>
  );
}
