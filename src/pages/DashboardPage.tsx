import { Col, Row, Statistic } from "antd";

export default function DashboardPage() {
  return (
    <Row gutter={16} className="p-10">
      <Col span={12}>
        <Statistic title="Số khách hàng hôm nay" value={12} />
      </Col>
      <Col span={12}>
        <Statistic title="Doanh số hôm nay" value={'300,000 VND'} />
      </Col>
      <Col span={12}>
        <Statistic title="Doanh số tháng này" value={'300,000 VND'} />
      </Col>
      <Col span={12}>
        <Statistic title="Khách hàng tháng này" value={200} />
      </Col>
    </Row>
  );
}
