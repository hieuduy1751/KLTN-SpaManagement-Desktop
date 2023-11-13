import { Spin } from "antd";
import { useEffect } from "react";
import { LoadingOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";


export default function LoadingPage() {
  const navigate = useNavigate()  

  useEffect(() => {
    setTimeout(() => {
      navigate('/auth/login')
    }, 1000)
  }, [])

  return (
    <div className="w-full h-[100vh] flex justify-center items-center">
      <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
    </div>
  );
}
