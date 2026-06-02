import { Card, Typography, Tag, Skeleton, Input, Button, Space, message, Empty, Row, Col } from 'antd';
import { Copy, Download, Briefcase, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function ResultsPanel({ results, loading }) {
  const [messageApi, contextHolder] = message.useMessage();

  const handleCopy = () => {
    if (results?.email) {
      navigator.clipboard.writeText(results.email);
      messageApi.success('Email copied to clipboard!');
    }
  };

  const handleDownload = () => {
    if (results?.email) {
      const element = document.createElement("a");
      const file = new Blob([results.email], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = "cold_email.txt";
      document.body.appendChild(element); // Required for this to work in FireFox
      element.click();
      messageApi.success('Downloaded successfully!');
    }
  };

  if (!results && !loading) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        style={{ height: '100%' }}
      >
        <Card className="glass-card" bordered={false} style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
          <Empty 
            image={<Sparkles size={48} style={{ color: '#334155', margin: '0 auto', display: 'block', marginBottom: 16 }} />}
            description={
              <Text type="secondary" style={{ fontSize: 16 }}>
                Enter a job URL and generate your personalized cold email.
              </Text>
            }
          />
        </Card>
      </motion.div>
    );
  }

  return (
    <>
      {contextHolder}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          
          {/* Job Details Card */}
          <Card className="glass-card" bordered={false}>
            <Title level={5} style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 0 }}>
              <Briefcase size={18} /> Extracted Job Details
            </Title>
            <Skeleton active loading={loading} paragraph={{ rows: 2 }}>
              {results && (
                <div style={{ marginTop: 16 }}>
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <Text type="secondary" style={{ display: 'block', marginBottom: 4 }}>Role</Text>
                      <Text strong>{results.role}</Text>
                    </Col>
                    <Col span={12}>
                      <Text type="secondary" style={{ display: 'block', marginBottom: 4 }}>Experience Required</Text>
                      <Text strong>{results.experience}</Text>
                    </Col>
                    <Col span={24}>
                      <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>Key Skills</Text>
                      <div>
                        {results.skills.map(skill => (
                          <Tag key={skill} color="blue" style={{ marginBottom: 8, padding: '4px 8px', borderRadius: 6, background: 'rgba(22, 119, 255, 0.1)', borderColor: 'rgba(22, 119, 255, 0.2)' }}>
                            {skill}
                          </Tag>
                        ))}
                      </div>
                    </Col>
                  </Row>
                </div>
              )}
            </Skeleton>
          </Card>

          {/* Generated Email Card */}
          <Card 
            className="glass-card" 
            bordered={false}
            title={
              <Title level={5} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Sparkles size={18} style={{ color: '#38bdf8' }} /> Generated Email
              </Title>
            }
            extra={
              <Space>
                <Button 
                  icon={<Copy size={16} />} 
                  onClick={handleCopy}
                  disabled={loading}
                  type="text"
                />
                <Button 
                  icon={<Download size={16} />} 
                  onClick={handleDownload}
                  disabled={loading}
                  type="text"
                />
              </Space>
            }
          >
            <Skeleton active loading={loading} paragraph={{ rows: 6 }}>
              {results && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <TextArea 
                    value={results.email}
                    autoSize={{ minRows: 8, maxRows: 15 }}
                    style={{ 
                      fontSize: '1rem', 
                      lineHeight: 1.6, 
                      padding: 16,
                      background: 'rgba(15, 23, 42, 0.4)',
                      borderRadius: 8,
                      borderColor: 'rgba(255, 255, 255, 0.1)'
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {results.email.length} characters
                    </Text>
                  </div>
                </motion.div>
              )}
            </Skeleton>
          </Card>

        </Space>
      </motion.div>
    </>
  );
}
