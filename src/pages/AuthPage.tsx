import { useState } from "react";
import { Button, Checkbox, Form, Input, Spin, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../hooks/reduxHooks";
import { doLogin } from "../store/slices/authSlice";
import { LoadingOutlined } from "@ant-design/icons";
import SpaLogo from "../assets/spa_logo.png";

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

export default function AuthPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onFinish = (formValues: any) => {
    setErrorMessage("");
    setLoading(true);
    dispatch(
      doLogin({
        username: formValues.username,
        password: formValues.password,
      })
    )
      .unwrap()
      .then(() => {
        navigate("/home/dashboard");
        setLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
        setErrorMessage(err.message);
        setLoading(false)
      });
  };
  const onFinishFailed = (errorInfo: any) => {
    console.log("failed", errorInfo);
  };

  return (
    <div className="w-full h-[100vh] flex justify-center items-center">
      <div className="w-96">
        <div className="flex justify-center">
          <img src={SpaLogo} alt="spa logo" className="w-48" />
        </div>
        <h4 className="text-4xl font-bold mb-4">Đăng nhập</h4>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="Tên đăng nhập"
            name="username"
            rules={[
              {
                required: true,
                message: "Tên đăng nhập không được để trống !",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Mật khẩu"
            name="password"
            rules={[
              { required: true, message: "Mật khẩu không được để trống !" },
            ]}
          >
            <Input.Password />
          </Form.Item>

          {errorMessage !== "" && (
            <Typography.Text className="text-center block" type="danger">
              {errorMessage}
            </Typography.Text>
          )}

          <Form.Item<FieldType>
            name="remember"
            valuePropName="checked"
            wrapperCol={{ offset: 8, span: 16 }}
          >
            <Checkbox>Ghi nhớ đăng nhập</Checkbox>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Xác nhận
              {loading && (
                <Spin
                  indicator={
                    <LoadingOutlined
                      className="ml-2 text-white"
                      style={{ fontSize: 18 }}
                      spin
                    />
                  }
                />
              )}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
