import './OverallSection.scss';

import MapImg from '../../../assets/img/worldmap.png';
import OverallStats from './OverallStats';

const OverallSection = () => {
  return (
    <>
      <div className="mobile-map">
        <img src={MapImg} alt="map" />
      </div>

      <section className="overall-section">
        <div className="overall-section-wrapper">
          <div className="blur30" />
          <div className="together-txt">
            Together we will impact the gaming world as one
          </div>
          <div className="crypto-txt">
            Our P2E engine focuses on the best investments in crypto gaming
            &amp; meta verse economies to generate the highest yield for our
            holders. We do this in various ways, specializing in deal
            acquisitions in and off market deals that are not readily available
            to the public. Due to our decade in the space and various
            connections, we are able to get early acquisitions for the top games
            and assets.
          </div>

          <OverallStats />
        </div>
      </section>
    </>
  );
};

export default OverallSection;
