import './InvestmentsSection.scss';
import EllipseRightImg from '../../../assets/img/ellipse-right.png';
import games from './InvestmentsSection.json';

const InvestmentsSection = () => {
  return (
    <section className="investments-section">
      <div className="flex-playing">
        <div className="playing-txt">Some Of Our Investments</div>
      </div>
      <div className="grid-games">
        {games.map((game) => (
          <div className="game-item" key={`game-item-${game.id}`}>
            <div
              className="game-item_image"
              style={{
                backgroundImage: `url(/img/games/${game.id}.jpg)`,
              }}
            >
              <a href={game.link} target="_blank" rel="noreferrer">
                &nbsp;
              </a>
            </div>
            <div className="game-item_name">{game.name}</div>
            <div className="game-item_description">{game.description}</div>
            <div className="game-item_link">
              <a href={game.link} target="_blank" rel="noreferrer">
                View website
              </a>
            </div>
          </div>
        ))}
      </div>
      <div className="game-right-ellipse">
        <img className="ellipse-size" src={EllipseRightImg} alt="ellipse" />
      </div>
    </section>
  );
};

export default InvestmentsSection;
