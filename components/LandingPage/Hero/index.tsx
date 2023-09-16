import { Paper, Text, Container } from '@mantine/core';
import { useEffect, useState } from 'react';
import { nanoid } from 'nanoid';
import { isBrowser, isMobile } from 'react-device-detect';
import { convertISOToFlag } from '@/utilities/convertISOToFlag';
import { readCountries } from '@/utilities/API';
import { Layout } from '../Layout';
import { GeographicalInformationType } from '@/utilities/api-types';
import { getGeographicalInformation } from '@/utilities/API';

export default function Hero() {
  const [geographicalInformation, setGeographicalInformation] =
    useState<GeographicalInformationType>({
      country_code: '',
      country_name: '',
      city: '',
      postal: '',
      latitude: 0,
      longitude: 0,
      ip: '',
      state: '',
      region: '',
      region_code: '',
      country: '',
      timezone: '',
    });
  const [sessionID, setSessionID] = useState<string>('');

  const getGeoData = async () => {
    const geographicalInformation = await getGeographicalInformation();
    setGeographicalInformation(geographicalInformation);
  };

  useEffect(() => {
    const randomSessionID = nanoid();
    setSessionID(randomSessionID);
    getGeoData();
  }, []);
  
  return (
    <Container h={"100%"} mih={"100%"} p={0} miw={"100%"} mah={"100%"}>
      <Layout/>
      {/* <Paper shadow={"xl"} w={"100%"} m={"xl"} p={"md"} radius={"md"}>
        <Text ff={"monospace"}>Session: {sessionID}</Text>
        <Text ff={"monospace"}>Mobile: {`${isMobile}`}</Text>
        <Text ff={"monospace"}>Desktop: {`${isBrowser}`}</Text>
        <Text ff={"monospace"}>IP: {geographicalInformation.IPv4}</Text>
        <Text ff={"monospace"}>Country: {convertISOToFlag(geographicalInformation.country_code)} {geographicalInformation.country_name} ({geographicalInformation.country_code})</Text>
        <Text ff={"monospace"}>State: {geographicalInformation.state}</Text>
        <Text ff={"monospace"}>City: {geographicalInformation.city}</Text>
        <Text ff={"monospace"}>Postal Code: {geographicalInformation.postal}</Text>
        <Text ff={"monospace"}>Co-ordinates: [{geographicalInformation.latitude}, {geographicalInformation.longitude}]</Text>
      </Paper> */}
    </Container>
  );
}
