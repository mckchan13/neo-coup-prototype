export interface PlayerActionButtonProps {
  onClick: () => void;
  disabled: boolean;
  style?: React.CSSProperties;
  title: string;
}

export default function PlayerActionButton(props: PlayerActionButtonProps) {
  const { onClick, disabled, style, title } = props;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ width: "100%", marginTop: "10px", ...style }}
    >
      {title}
    </button>
  );
}
