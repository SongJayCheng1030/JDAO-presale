import './Home.scss';
import 'react-multi-carousel/lib/styles.css';


import Footer from './components/Footer';
import BannerSection from './components/BannerSection';
import OverallSection from './components/OverallSection';
import RoadmapCardSection from './components/RoadmapCardSection';
// import TokenomicsSection from './components/TokenomicsSection';
import CommunitySection from './components/CommunitySection';
import InvestmentsSection from './components/InvestmentsSection';
import { Helmet } from 'react-helmet';
import Header from '../../components/common/Header';

const Home = () => {
  return (
    <div className="home-page">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Home | Joystick</title>
        <meta property="og:url" content="joystickgames.com/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Home | Joystick" />
        <meta property="og:site_name" content="Joystick" />
        <meta
          property="og:description"
          content="The #1 Gaming DAO Worldwide Innovative DAO focused on gaming & maximum yield generation."
        />
        <meta
          property="og:image"
          content="https://joystickgames.com/img/logo.png"
        />
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-TDFM9R4DLP"
        ></script>
        <script>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
          
            gtag('config', 'G-TDFM9R4DLP');
          `}
        </script>
      </Helmet>
      <Header />
      <BannerSection />
      <OverallSection />
      <InvestmentsSection />
      <RoadmapCardSection />
      {/* <TokenomicsSection /> */}
      <CommunitySection />
      <Footer />
    </div>
  );
};

export default Home;
