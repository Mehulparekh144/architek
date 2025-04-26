
export type Message = {
  type: "sent" | "received";
  message: string;
  thinking: boolean;
  id: string;
};

export type Shape = {
  id: string;
  type: string;
  text: string;
  position: {
    x: number;
    y: number;
  };
}
