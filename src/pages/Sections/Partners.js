import styled from 'styled-components';

const PartnersSection = styled.section`
  background-color: #f8f8f8;
  padding: 50px;
`;

const PartnersTitle = styled.h2`
  font-size: 36px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px`;

const PartnerLogo = styled.img`
  width: 100px;
  height: 100px;
  margin-right: 20px;
`;

const PartnerList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin: 0;
  padding: 0;
`;

const PartnerItem = styled.li`
  display: flex;
  align-items: center;
  margin-right: 20px;
  margin-bottom: 20px;
`;

function Partners() {
  return (
    <PartnersSection>
      <PartnersTitle>Partners</PartnersTitle>
      <PartnerList>
        <PartnerItem>
          <PartnerLogo src="path/to/logo1.png" alt="Partner Logo 1" />
        </PartnerItem>
        <PartnerItem>
          <PartnerLogo src="path/to/logo2.png" alt="Partner Logo 2" />
        </PartnerItem>
        <PartnerItem>
          <PartnerLogo src="path/to/logo3.png" alt="Partner Logo 3" />
        </PartnerItem>
        <PartnerItem>
          <PartnerLogo src="path/to/logo4.png" alt="Partner Logo 4" />
        </PartnerItem>
        <PartnerItem>
          <PartnerLogo src="path/to/logo5.png" alt="Partner Logo 5" />
        </PartnerItem>
        <PartnerItem>
          <PartnerLogo src=".path/to/logo6.png" alt="Partner Logo 6" />
        </PartnerItem>
      </PartnerList>
    </PartnersSection>
  );
}

export default Partners;
