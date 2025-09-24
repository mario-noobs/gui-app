import React from 'react';

interface MatchIndicatorProps {
  probability: number;
}

const MatchIndicator: React.FC<MatchIndicatorProps> = ({ probability }) => {
  // Convert to percentage for easier understanding
  const percentage = (probability * 100).toFixed(2);
  
  // Determine confidence level and corresponding styles
  const getConfidenceLevel = () => {
    if (probability < 0.6) {
      return {
        level: 'Low Confidence',
        color: '#ff4d4d', // Red
        width: `${percentage}%`,
        backgroundColor: '#ffe6e6', // Light red background
        textColor: '#cc0000',
        icon: '⚠️'
      };
    } else if (probability < 0.8) {
      return {
        level: 'Moderate Confidence',
        color: '#ffa500', // Orange
        width: `${percentage}%`,
        backgroundColor: '#fff4e6', // Light orange background
        textColor: '#cc7000',
        icon: '⚠️'
      };
    } else {
      return {
        level: 'High Confidence',
        color: '#4caf50', // Green
        width: `${percentage}%`,
        backgroundColor: '#e6f7e6', // Light green background
        textColor: '#2e7d32',
        icon: '✅'
      };
    }
  };

  const confidenceInfo = getConfidenceLevel();

  return (
    <div className="confidence-indicator-container" style={{
      marginTop: '15px',
      backgroundColor: confidenceInfo.backgroundColor,
      padding: '15px',
      borderRadius: '10px',
      border: `1px solid ${confidenceInfo.color}`,
      transition: 'all 0.3s ease'
    }}>
      <div style={{
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px'
      }}>
        <div style={{ 
          fontWeight: 'bold',
          color: confidenceInfo.textColor,
          display: 'flex',
          alignItems: 'center',
          fontSize: '16px'
        }}>
          <span style={{ marginRight: '8px' }}>{confidenceInfo.icon}</span>
          {confidenceInfo.level}
        </div>
        <div style={{ 
          fontWeight: 'bold',
          color: confidenceInfo.textColor,
          backgroundColor: 'white',
          padding: '4px 10px',
          borderRadius: '20px',
          border: `1px solid ${confidenceInfo.color}`,
          fontSize: '15px'
        }}>
          {percentage}%
        </div>
      </div>
      
      <div style={{ 
        width: '100%', 
        height: '14px',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          width: confidenceInfo.width,
          height: '100%',
          backgroundColor: confidenceInfo.color,
          borderRadius: '10px',
          transition: 'width 0.8s ease-in-out',
          boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
        }} />
      </div>
    </div>
  );
};

export default MatchIndicator;
