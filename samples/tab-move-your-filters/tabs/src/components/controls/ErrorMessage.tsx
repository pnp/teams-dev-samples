import { Alert } from "@fluentui/react-northstar";

interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage(props: ErrorMessageProps) {
  return (
    <Alert warning content={props.message} />
  );
}