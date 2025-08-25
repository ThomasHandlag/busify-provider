import { Form, Input, Button, Checkbox, type FormProps, Flex } from "antd";
import { useState } from "react";
import { useGNotify } from "../../app/hooks";
import { useAuthStore } from "../../stores/auth_store";
import { useNavigate } from "react-router";
import { LockOutlined, MailOutlined } from "@ant-design/icons";

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
    try {
      await login({
        username: values.username || "",
        password: values.password || "",
        navigate,
      });
    } catch (e) {
      const error = e as Error;
      console.error("Login error:", error);
      setLoading(false);
      notify?.error({
        message: "Login Failed",
        description: error?.message || "Unknown error",
        placement: "bottomRight",
      });
    }
  };

  const [loading, setLoading] = useState(false);

  return (
    <div className="flex items-center justify-center p-10">
      <div className="min-w-96 p-10 rounded bg-gray-50 shadow">
        <Form
          name="loginForm"
          initialValues={{ rememberMe: true }}
          onFinish={onFinish}
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
            <Input prefix={<MailOutlined />} />
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
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>
          <Form.Item>
            <Flex justify="space-between" align="center">
              <Form.Item name="rememberMe" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <a href="">Forgot password</a>
            </Flex>
          </Form.Item>
          <Form.Item>
            <Button
              block
              type="primary"
              htmlType="submit"
              loading={loading}
              iconPosition="start"
            >
              Log in
            </Button>
            or <a href="">Register now!</a>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
