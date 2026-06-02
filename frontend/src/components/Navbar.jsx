import { Layout, Button, Space, Typography } from 'antd';
import { GithubOutlined, MailOutlined } from '@ant-design/icons';

const { Header } = Layout;
const { Title } = Typography;

export default function Navbar() {
  return (
    <Header style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      background: 'rgba(15, 23, 42, 0.8)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '0 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <Space align="center" size="middle">
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 8,
          background: 'linear-gradient(135deg, #1677ff 0%, #38bdf8 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white'
        }}>
          <MailOutlined style={{ fontSize: 20 }} />
        </div>
        <Title level={4} style={{ margin: 0, fontWeight: 600 }}>
          MailGen AI
        </Title>
      </Space>
      <Space>
        <Button 
          type="text" 
          icon={<GithubOutlined style={{ fontSize: 20 }} />} 
          href="https://github.com"
          target="_blank"
        />
      </Space>
    </Header>
  );
}
