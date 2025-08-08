import { Result } from "antd";

const UnauthicatedPage = () => {
  return (
    <Result
      status="403"
      title="403"
      subTitle="Sorry, you are not authorized to access this page."
    />
  );
};

export default UnauthicatedPage;
