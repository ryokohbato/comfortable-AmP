export interface MessagesToBackground
{
  From: "popup"|"tabs";
  Title: string;
  Value: boolean|number;
}