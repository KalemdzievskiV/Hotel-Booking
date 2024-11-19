
export const eventStyleGetter = (
  event: any, 
  start: Date, 
  end: Date, 
  isSelected: boolean,
) => {
  let backgroundColor = event.color; // Default color
  let style = {};

  if (isSelected) {
    style = {
      ...style,
      border: "2px solid #000", // Custom border for selected events
    };
  }

  return {
    style: {
      backgroundColor,
      color: "#fff",
      borderRadius: "15px",
      margin: "5px",
      opacity: 0.8,
      display: "block",
      ...style,
    },
  };
};