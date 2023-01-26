import './GlowBorderedCard.scss';

const GlowBorderedCard = (props: {
  tag?: string;
  title: string;
  content: string;
}) => {
  return (
    <div className="glow-bordered-card">
      <div className="glow-bordered-border-h top" />
      <div className="glow-bordered-border-v right" />
      <div className="glow-bordered-border-h bottom" />
      <div className="glow-bordered-border-v left" />
      {props.tag && <div className="glow-bordered-tag">{props.tag}</div>}
      <div className="glow-bordered-title">{props.title}</div>
      <div className="glow-bordered-bar" />
      <div className="glow-bordered-content">{props.content}</div>
    </div>
  );
};

export default GlowBorderedCard;
