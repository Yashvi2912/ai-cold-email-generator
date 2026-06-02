import { Form, Input, Select, Button, Card, Typography } from 'antd';
import { Link, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const { Title, Text } = Typography;

export default function GeneratorForm({ onGenerate, loading }) {
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    onGenerate(values);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="glass-card" bordered={false}>
        <div style={{ marginBottom: 24 }}>
          <Title level={4} style={{ margin: 0 }}>Campaign Details</Title>
          <Text type="secondary">Provide the job posting and tailor your outreach.</Text>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            tone: 'professional',
            template: 'standard'
          }}
        >
          <Form.Item
            name="url"
            label="Job Posting URL"
            rules={[{ required: true, message: 'Please enter a valid job URL' }]}
          >
            <Input 
              size="large" 
              prefix={<Link size={18} style={{ color: '#64748b', marginRight: 8 }} />} 
              placeholder="https://linkedin.com/jobs/view/..." 
              style={{ background: 'rgba(15, 23, 42, 0.4)' }}
            />
          </Form.Item>

          <Form.Item
            name="tone"
            label="Email Tone"
          >
            <Select size="large" style={{ background: 'rgba(15, 23, 42, 0.4)' }}>
              <Select.Option value="professional">Professional</Select.Option>
              <Select.Option value="friendly">Friendly & Approachable</Select.Option>
              <Select.Option value="salesy">Persuasive / Salesy</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="template"
            label="Email Template"
          >
            <Select size="large" style={{ background: 'rgba(15, 23, 42, 0.4)' }}>
              <Select.Option value="standard">Standard Outreach</Select.Option>
              <Select.Option value="consulting">Consulting Proposal</Select.Option>
              <Select.Option value="partnership">Partnership Request</Select.Option>
            </Select>
          </Form.Item>

          <Button 
            type="primary" 
            htmlType="submit" 
            size="large" 
            block 
            loading={loading}
            icon={<Sparkles size={18} />}
            style={{ 
              marginTop: 16,
              height: 48,
              fontSize: '1rem',
              fontWeight: 500,
              background: 'linear-gradient(135deg, #1677ff 0%, #38bdf8 100%)',
              border: 'none'
            }}
          >
            Generate Email
          </Button>
        </Form>
      </Card>
    </motion.div>
  );
}
