import { useState } from 'react';
import { Layout, Row, Col, App as AntApp, message } from 'antd';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import GeneratorForm from './components/GeneratorForm';
import ResultsPanel from './components/ResultsPanel';
import './App.css';

const { Content } = Layout;

function App() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleGenerate = async (formData) => {
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/generate-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || 'Failed to generate email. Make sure the backend is running.');
      }
      
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AntApp>
      <Layout className="app-container">
        <Navbar />
        <Content>
          <Hero />
          <div className="main-content">
            <Row gutter={[32, 32]}>
              <Col xs={24} lg={10}>
                <GeneratorForm onGenerate={handleGenerate} loading={loading} />
              </Col>
              <Col xs={24} lg={14}>
                <ResultsPanel results={results} loading={loading} />
              </Col>
            </Row>
          </div>
        </Content>
      </Layout>
    </AntApp>
  );
}

export default App;
