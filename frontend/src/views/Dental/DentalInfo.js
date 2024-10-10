import React from "react";
import "../../styles/globalStyles.css"; // 공통 CSS 파일
import {
  Col,
  Row,
  Space,
  Table,
  Tag,
  Card,
  Select,
  Button,
  InputNumber,
} from "antd";

const DentalInfo = () => {
  const columns = [
    {
      title: "치과",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "치료",
      key: "tags",
      dataIndex: "tags",
      render: (_, { tags }) => (
        <>
          {tags.map((tag) => {
            let color = tag.length > 5 ? "geekblue" : "green";
            if (tag === "loser") {
              color = "volcano";
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "진료",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "주소",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "방문자 리뷰",
      dataIndex: "review",
      key: "review",
    },
  ];
  const data = [
    {
      key: "1",
      name: "가나 치과",
      time: "진료 종료 / 09:30에 진료 시작",
      address: "서울 강남구 역삼동 1532-121",
      review: "방문자 리뷰 60 / 블로그 리뷰 25",
      tags: ["임플란트", "충치치료"],
    },
    {
      key: "2",
      name: "다라 치과",
      time: "진료 종료 / 09:30에 진료 시작",
      address: "서울 강남구 논현동 1032-121",
      review: "방문자 리뷰 80 / 블로그 리뷰 75",
      tags: ["치아교정"],
    },
  ];

  const handleChange = (value) => {
    // console.log(`selected ${value}`);
  };

  const onChange = (value) => {
    // console.log("changed", value);
  };

  return (
    <>
      <Row
        style={{
          marginTop: "40px",
        }}
      >
        <Col span={24}>
          <Card
            style={{
              width: "100%",
              marginBottom: "30px",
              backgroundColor: "#FFFFFF",
            }}
          >
            <Row>
              <Col span={8} style={{ marginBottom: "10px" }}>
                <span style={{ fontWeight: "bold" }}>지역</span>
              </Col>
              <Col span={4} style={{ marginBottom: "10px" }}>
                <span style={{ fontWeight: "bold" }}>치료</span>
              </Col>
              <Col span={4} style={{ marginBottom: "10px" }}>
                <span style={{ fontWeight: "bold" }}>진료 시간</span>
              </Col>
              <Col span={8} style={{ marginBottom: "10px" }}>
                <span style={{ fontWeight: "bold" }}>가격</span>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Space wrap>
                  <Select
                    defaultValue="서울"
                    style={{
                      width: 90,
                    }}
                    onChange={handleChange}
                    options={[
                      {
                        value: "서울",
                        label: "서울",
                      },
                      {
                        value: "부산",
                        label: "부산",
                      },
                      {
                        value: "울산",
                        label: "울산",
                      },
                    ]}
                  />
                  <Select
                    defaultValue="강남구"
                    style={{
                      width: 90,
                    }}
                    onChange={handleChange}
                    options={[
                      {
                        value: "강남구",
                        label: "강남구",
                      },
                      {
                        value: "강서구",
                        label: "강서구",
                      },
                      {
                        value: "서초구",
                        label: "서초구",
                      },
                    ]}
                  />
                  <Select
                    defaultValue="논현동"
                    style={{
                      width: 90,
                    }}
                    onChange={handleChange}
                    options={[
                      {
                        value: "논현동",
                        label: "논현동",
                      },
                      {
                        value: "개포동",
                        label: "개포동",
                      },
                      {
                        value: "한남동",
                        label: "한남동",
                      },
                    ]}
                  />
                </Space>
              </Col>
              <Col span={4}>
                <Space wrap>
                  <Select
                    defaultValue="전체"
                    style={{
                      width: 120,
                    }}
                    onChange={handleChange}
                    options={[
                      {
                        value: "임플란트",
                        label: "임플란트",
                      },
                      {
                        value: "충치치료",
                        label: "충치치료",
                      },
                      {
                        value: "치아교정",
                        label: "치아교정",
                      },
                    ]}
                  />
                </Space>
              </Col>
              <Col span={4}>
                <Space wrap>
                  <Select
                    defaultValue="전체"
                    style={{
                      width: 120,
                    }}
                    onChange={handleChange}
                    options={[
                      {
                        value: "전체",
                        label: "전체",
                      },
                      {
                        value: "진료중",
                        label: "진료중",
                      },
                      {
                        value: "야간진료",
                        label: "야간진료",
                      },
                      {
                        value: "휴일진료",
                        label: "휴일진료",
                      },
                    ]}
                  />
                </Space>
              </Col>
              <Col span={8} style={{ marginBottom: "10px" }}>
                <Row align="middle">
                  <Col span={5}>
                    <InputNumber
                      min={1}
                      max={100000}
                      defaultValue={3}
                      onChange={onChange}
                    />
                  </Col>
                  <Col span={3} style={{ textAlign: "center" }}>
                    <span>~</span>
                  </Col>
                  <Col span={5}>
                    <InputNumber
                      min={1}
                      max={100000}
                      defaultValue={3}
                      onChange={onChange}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row justify="end">
              <Button
                type="default"
                size="middle"
                variant="solid"
                id="dentalBtn"
              >
                찾기
              </Button>
            </Row>
          </Card>
        </Col>
        <Col span={24}>2 건</Col>
        <Col span={24}>
          <Table
            columns={columns}
            dataSource={data}
            style={{ width: "100%" }}
          />
        </Col>
      </Row>
    </>
  );
};

export default DentalInfo;
