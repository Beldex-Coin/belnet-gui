import React from 'react';
import styled from 'styled-components';
import Australia from '../../../images/country/Australia.png';
import Canada from '../../../images/country/Canada.png';
import France from '../../../images/country/France.png';
import Germany from '../../../images/country/Germany.png';
import Japan from '../../../images/country/Japan.png';
import Lithuania from '../../../images/country/Lithuania.png';
import Netherlands from '../../../images/country/Netherlands.png';
import Singapore from '../../../images/country/Singapore.png';
import USA from '../../../images/country/USA.png';

const CountryFlagsList: any = {
    australia: Australia,
    canada: Canada,
    france: France,
    germany: Germany,
    japan: Japan,
    lithuania: Lithuania,
    netherlands: Netherlands,
    singapore: Singapore,
    usa: USA
}


const CountryFlagImg = styled.img<{ ledColor: string }>`
  width: auto;
  height: 10px;
  padding-right: 10px;
`;

const CountryFlags = (props: any) => {
    const imgSrc = CountryFlagsList[props.countryName];
    return (
        <CountryFlagImg id={props.keyItem} src={imgSrc} />
    )
}

export default React.memo(CountryFlags);
