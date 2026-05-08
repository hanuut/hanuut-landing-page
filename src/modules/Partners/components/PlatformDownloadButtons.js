import React from 'react';
import styled from 'styled-components';
import { FaApple } from 'react-icons/fa';
import BorderBeamButton from '../../../components/BorderBeamButton';
import useDetectedPlatform from '../../../hooks/useDetectedPlatform';

import WindowsSvg from '../../../assets/windows.svg';
import PlaystoreImg from '../../../assets/playstore.webp';

const API_URL = process.env.REACT_APP_API_PROD_URL || 'https://api.hanuut.com';

const PLATFORMS = {
  windows: {
    label: 'Download for Windows',
    shortLabel: 'Windows',
    icon: 'windows',
    beamColor: '#397FF9',
    onDownload: () => { window.location.href = `${API_URL}/download/windows/latest`; },
  },
  macos: {
    label: 'Download for Mac',
    shortLabel: 'macOS',
    icon: 'apple',
    beamColor: '#397FF9',
    // TODO: swap URL once macOS build is ready
    onDownload: () => { window.location.href = `${API_URL}/download/macos/latest`; },
  },
  android: {
    label: 'Get it on Android',
    shortLabel: 'Android',
    icon: 'playstore',
    beamColor: '#F07A48',
    onDownload: () => { window.open(process.env.REACT_APP_MY_HANUUT_DOWNLOAD_LINK_GOOGLE_PLAY, '_blank'); },
  },
  ios: {
    label: 'Get it on iOS',
    shortLabel: 'iOS',
    icon: 'apple',
    beamColor: '#F07A48',
    onDownload: () => { window.open('https://apps.apple.com/us/app/my-hanuut/id6762234117', '_blank'); },
  },
};

const PRIORITY_MAP = {
  windows: ['windows', 'macos', 'android', 'ios'],
  macos: ['macos', 'windows', 'android', 'ios'],
  android: ['android', 'ios', 'windows', 'macos'],
  ios: ['ios', 'android', 'windows', 'macos'],
  other: ['windows', 'macos', 'android', 'ios'],
};

// --- Sub-components ---
const PlatformIcon = ({ name, size = '1.5rem' }) => {
  const style = { height: size, fontSize: size };
  if (name === 'windows') return <img src={WindowsSvg} alt="Windows" style={style} />;
  if (name === 'apple') return <FaApple style={style} />;
  if (name === 'playstore') return <img src={PlaystoreImg} alt="Play Store" style={{ ...style, filter: 'invert(1)' }} />;
  return null;
};

// --- Styled Components ---
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
  pointer-events: auto;
`;

const SecondaryWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.45);
  font-size: 0.85rem;
`;

const SecondaryLabel = styled.span`
  margin-right: 0.25rem;
`;

const SecondaryButton = styled.button`
  background: transparent;
  border: none;
  color: inherit;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0;
  font-family: inherit;
  transition: color 0.2s ease;

  &:hover {
    color: rgba(255, 255, 255, 0.85);
  }
`;

const Divider = styled.span`
  color: rgba(255, 255, 255, 0.2);
`;

const PlatformDownloadButtons = ({ layout = 'hero' }) => {
  const platform = useDetectedPlatform();
  
  const order = PRIORITY_MAP[platform] || PRIORITY_MAP['other'];
  const [primaryKey, ...secondaryKeys] = order;
  const primary = PLATFORMS[primaryKey];

  return (
    <Wrapper className={`platform-buttons--${layout}`}>
      {/* Primary Hero Button */}
      <BorderBeamButton
        onClick={primary.onDownload}
        beamColor={primary.beamColor}
        secondary={false}
      >
        <PlatformIcon name={primary.icon} />
        <span>{primary.label}</span>
      </BorderBeamButton>

      {/* Subordinate Alternate Options */}
      <SecondaryWrapper>
        <SecondaryLabel>Also available on:</SecondaryLabel>
        {secondaryKeys.map((key, index) => {
          const p = PLATFORMS[key];
          return (
            <React.Fragment key={key}>
              <SecondaryButton onClick={p.onDownload}>
                <PlatformIcon name={p.icon} size="0.9rem" />
                <span>{p.shortLabel}</span>
              </SecondaryButton>
              {index < secondaryKeys.length - 1 && <Divider>·</Divider>}
            </React.Fragment>
          );
        })}
      </SecondaryWrapper>
    </Wrapper>
  );
};

export default PlatformDownloadButtons;