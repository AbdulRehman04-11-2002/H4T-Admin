import { Card, Col, Row } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { formattedDateTime } from "../../helpers/globalFunctions/fetchHandlers";

type Props = {
  order: any;
};

const OrderInfo = ({ order }: Props) => {
  const { t } = useTranslation();
  const ORDER: any = t("ORDER", { returnObjects: true });
  const date = order?.serviceDateTime;
  const timezone = order?.partnerLocation?.timeZone;

  const orderItems = [
    {
      index: 0,
      title: `${ORDER.VISITOR}`,
      content: (
        <>
          <div>{`${order.visitorFirstName} ${order.visitorLastName}`}</div>
          <div>{order.visitorEmailAddress}</div>
          <div>{order.visitorPhoneNumber}</div>
        </>
      ),
    },
    {
      index: 1,
      title: `${ORDER.INSURANCE}`,
      content: (
        <>
          <div>
            {order?.insuranceProviderName
              ? `${ORDER.INSURANCE_NAME} ${order?.insuranceProviderName}`
              : ORDER.NAME_NOT_PROVIDED}
          </div>
          <div>
            {order?.insurancePolicyNumber
              ? `${ORDER.POLICY_NUMBER} ${order?.insurancePolicyNumber}`
              : ORDER.NUMBER_NOT_PROVIDED}
          </div>
        </>
      ),
    },
    {
      index: 2,
      title: `${ORDER.DATE_TIME}`,
      content: (
        <>
          <div>{formattedDateTime(date, timezone, "MMM DD, dddd")}</div>
          <div>{formattedDateTime(date, timezone, "HH:mm")}</div>
        </>
      ),
    },
  ];
  return (
    <div className="booking-details">
      <Row gutter={[16, 16]} style={{ display: "flex", flexWrap: "wrap" }}>
        {orderItems.length > 0 &&
          orderItems.map((order, index) => (
            <Col
              key={index}
              xs={24}
              sm={12}
              md={8}
              lg={8}
              xl={8}
              style={{
                marginBottom: "16px",
                paddingInline: "6px",
                display: "flex",
              }}
            >
              <Card
                title={order.title}
                bordered={false}
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  background: "rgb(232, 236, 239)",
                }}
              >
                {order.content}
              </Card>
            </Col>
          ))}
      </Row>
    </div>
  );
};

export default OrderInfo;
