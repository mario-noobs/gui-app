import { useState } from 'react';
import '../style/UploadStyles.css';
import { RecognizeFaceBiometricAPI } from '../services/apis';
import { IFace } from '../../models/face';
import LoadingPage from '../../../core/components/Loading';
import { useFaceNotificationContext } from '../../context/FaceNotificationContextType';
import MatchIndicator from './MatchIndicator';
import UploadForm from '../../components/UploadForm';

interface MatchResult {
  userId: string;
  firstName?: string;
  lastName?: string;
  distance: number;
  matched: boolean;
  confidence: number;
}

function distanceToConfidence(distance: number, matched: boolean): number {
  if (!matched) return 0;
  // Convert L2 distance to cosine similarity for L2-normalized embeddings
  // For unit vectors: cos_sim = 1 - d²/2
  return Math.max(0, Math.min(1, 1 - (distance * distance) / 2));
}

const Recognize = () => {
  const { showNotification } = useFaceNotificationContext();
  const [image, setImage] = useState<string | null>(null);
  const [base64, setBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [bestMatch, setBestMatch] = useState<MatchResult | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleImageChange = (img: string | null, b64: string | null) => {
    setImage(img);
    setBase64(b64);
    setMatches([]);
    setBestMatch(null);
    setHasSearched(false);
  };

  const handleSubmit = async () => {
    if (base64) {
      setLoading(true);
      await handleRecognizeBiometric({ image_data: base64 });
    } else {
      showNotification({
        path: '/face/recognize',
        code: 'CLIENT_ERROR',
        message: 'No image data available. Please upload an image first.',
      });
    }
  };

  const handleRecognizeBiometric = async (data: IFace) => {
    setLoading(true);
    try {
      const response = await RecognizeFaceBiometricAPI(data) as { data: any };
      const resData = response.data;

      if (resData.code === '0000') {
        const recognitionData = resData.data;
        const rawMatches: any[] = recognitionData?.matches || [];

        const parsedMatches: MatchResult[] = rawMatches.map((m: any) => ({
          userId: String(m.userId),
          firstName: m.firstName || undefined,
          lastName: m.lastName || undefined,
          distance: Number(m.distance),
          matched: Boolean(m.matched),
          confidence: distanceToConfidence(Number(m.distance), Boolean(m.matched)),
        }));

        setMatches(parsedMatches);
        setHasSearched(true);

        const best = parsedMatches.find((m) => m.matched) || null;
        setBestMatch(best);

        showNotification({
          path: '/api/v1/face/recognize',
          code: resData.code,
          message: resData.message || 'Recognition successful!',
        });
      } else {
        showNotification({
          path: '/api/v1/face/recognize',
          code: resData.code,
          message: resData.message || 'Recognition failed.',
        });
        setMatches([]);
        setBestMatch(null);
      }
    } catch (error: any) {
      showNotification({
        path: '/api/v1/face/recognize',
        code: 'SERVER_ERROR',
        message: error?.message || 'An error occurred during recognition.',
      });
      setMatches([]);
      setBestMatch(null);
    } finally {
      setLoading(false);
    }
  };

  const handleClearImage = (event: { stopPropagation: () => void }) => {
    event.stopPropagation();
    setImage(null);
    setBase64(null);
    setMatches([]);
    setBestMatch(null);
    setHasSearched(false);
  };

  const getUserDisplayName = (match: MatchResult): string => {
    if (match.firstName || match.lastName) {
      return `${match.firstName || ''} ${match.lastName || ''}`.trim();
    }
    return `User #${match.userId}`;
  };

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="upload-container" style={{
      maxWidth: '90%',
      width: '800px',
      margin: '0 auto'
    }}>
      <UploadForm
        image={image}
        loading={loading}
        onImageChange={handleImageChange}
        buttonText="Drag & drop or click to upload your face image for recognition"
      />

      {/* Best Match Result */}
      {bestMatch && (
        <div className="recognition-results" style={{
          marginTop: '25px',
          padding: '20px',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
          border: '1px solid #e0e0e0',
          width: '100%'
        }}>
          <h3 style={{
            marginTop: 0,
            marginBottom: '15px',
            color: '#333',
            fontSize: '1.4rem',
            borderBottom: '2px solid #f0f0f0',
            paddingBottom: '10px'
          }}>
            Best Match
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px',
            marginBottom: '20px',
            backgroundColor: '#f9f9f9',
            padding: '12px',
            borderRadius: '8px'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', padding: '10px' }}>
              <span style={{
                fontSize: '0.85rem', color: '#666', marginBottom: '5px',
                textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 500
              }}>User</span>
              <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#333' }}>
                {getUserDisplayName(bestMatch)}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', padding: '10px' }}>
              <span style={{
                fontSize: '0.85rem', color: '#666', marginBottom: '5px',
                textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 500
              }}>Distance</span>
              <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#333' }}>
                {bestMatch.distance.toFixed(4)}
              </span>
            </div>
          </div>

          <div style={{ marginTop: '10px' }}>
            <div style={{
              fontSize: '0.85rem', color: '#666', marginBottom: '8px',
              textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 500
            }}>
              Confidence Score
            </div>
            <MatchIndicator probability={bestMatch.confidence} />
          </div>

          <div style={{
            marginTop: '15px',
            padding: '10px',
            borderRadius: '8px',
            backgroundColor: '#e8f5e9',
            border: '1px solid #c8e6c9',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#2e7d32' }}>
              Match Found
            </span>
          </div>
        </div>
      )}

      {/* No Match Result */}
      {hasSearched && matches.length === 0 && (
        <div style={{
          marginTop: '25px',
          padding: '20px',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
          border: '1px solid #e0e0e0',
          width: '100%'
        }}>
          <div style={{
            padding: '10px',
            borderRadius: '8px',
            backgroundColor: '#fce8e6',
            border: '1px solid #f8d7da',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#c62828' }}>
              No candidate found
            </span>
          </div>
        </div>
      )}

      {/* All Matches Table */}
      {matches.length > 0 && (
        <div style={{
          marginTop: '20px',
          padding: '20px',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
          border: '1px solid #e0e0e0',
          width: '100%'
        }}>
          <h3 style={{
            marginTop: 0,
            marginBottom: '15px',
            color: '#333',
            fontSize: '1.2rem',
            borderBottom: '2px solid #f0f0f0',
            paddingBottom: '10px'
          }}>
            All Candidates ({matches.length})
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.9rem'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5' }}>
                  <th style={thStyle}>User</th>
                  <th style={thStyle}>Distance</th>
                  <th style={thStyle}>Confidence</th>
                  <th style={thStyle}>Status</th>
                </tr>
              </thead>
              <tbody>
                {matches.map((match, idx) => (
                  <tr key={idx} style={{
                    backgroundColor: match.matched ? '#f1f8e9' : 'transparent',
                    borderBottom: '1px solid #eee'
                  }}>
                    <td style={tdStyle}>{getUserDisplayName(match)}</td>
                    <td style={tdStyle}>{match.distance.toFixed(4)}</td>
                    <td style={tdStyle}>{(match.confidence * 100).toFixed(1)}%</td>
                    <td style={tdStyle}>
                      <span style={{
                        padding: '3px 10px',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: match.matched ? '#2e7d32' : '#c62828',
                        backgroundColor: match.matched ? '#e8f5e9' : '#fce8e6'
                      }}>
                        {match.matched ? 'Matched' : 'Not matched'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="button-group" style={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: '20px',
        gap: '15px'
      }}>
        <button
          onClick={handleClearImage}
          className="submit-button"
          disabled={!base64}
          style={{ flex: 1, padding: '12px 20px' }}
        >
          Clear Data
        </button>
        <button
          onClick={handleSubmit}
          className="submit-button"
          disabled={!base64 || loading}
          style={{ flex: 1, padding: '12px 20px' }}
        >
          Recognize Face
        </button>
      </div>
    </div>
  );
};

const thStyle: React.CSSProperties = {
  padding: '10px 12px',
  textAlign: 'left',
  fontWeight: 600,
  color: '#555',
  fontSize: '0.85rem',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

const tdStyle: React.CSSProperties = {
  padding: '10px 12px',
  color: '#333',
};

export default Recognize;
