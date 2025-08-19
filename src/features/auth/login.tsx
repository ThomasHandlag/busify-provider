import { Form, Input, Button, Checkbox, type FormProps } from "antd";
import { useState } from "react";
import { useGNotify } from "../../app/hooks";
import { useAuthStore } from "../../stores/auth_store";
import { useNavigate } from "react-router";

type LoginFieldType = {
  username?: string;
  password?: string;
  rememberMe?: boolean;
};

const LoginPage = () => {
  const { notify } = useGNotify();
  const { login, error } = useAuthStore();
  const navigate = useNavigate();

  const onFinish: FormProps<LoginFieldType>["onFinish"] = async (
    values: LoginFieldType
  ) => {
    setLoading(true);
    await login({
      username: values.username || "",
      password: values.password || "",
      navigate,
    });

    setLoading(false);
    if (error) {
      notify?.error({
        message: "Login Failed",
        description: error,
        placement: "bottomRight",
      });
    } else {
      notify?.success({
        message: "Login Successful",
        placement: "bottomRight",
      });
    }
  };

  const onFinishFailed: FormProps<LoginFieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    setLoading(false);
    notify?.error({
      message: "Login Failed",
      description: errorInfo.errorFields[0]?.errors[0],
      placement: "bottomRight",
    });
  };

  const [loading, setLoading] = useState(false);

  return (
    <div className="flex items-center justify-center p-10">
      <div className="min-w-96 p-10 rounded bg-gray-50 shadow">
        <Form
          name="loginForm"
          initialValues={{ rememberMe: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item<LoginFieldType>
            validateDebounce={500}
            required
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please input your email!",
              },
              {
                type: "email",
                message: "Please enter a valid email!",
              },
            ]}
            label="Email"
            name="username"
          >
            <Input />
          </Form.Item>
          <Form.Item<LoginFieldType>
            validateDebounce={500}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
            required
            label="Password"
            name="password"
          >
            <Input.Password />
          </Form.Item>
          <Form.Item<LoginFieldType>
            label="Remember me"
            name="rememberMe"
            valuePropName="checked"
          >
            <Checkbox />
          </Form.Item>
          <Form.Item>
            <Button type="primary" loading={loading} htmlType="submit">
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
