import { useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { Container, Typography } from "@mui/material";
import { QUERY_COUPON } from "./apollo";
import Header from "../../components/layouts/header";

function Coupon() {
  const [getCoupons, { data: isData }] = useLazyQuery(QUERY_COUPON);

  async function getCouponData() {
    try {
      const res = await getCoupons();
      if (res?.data?.coupons) {
        // console.log(res?.data.coupons?.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getCouponData();
  }, [getCoupons]);

  return (
    <>
      <Header />
      <Container maxWidth="lg">
        <Typography variant="h4" mb="12px">
          Coupon
        </Typography>

        {isData?.coupons?.data?.map((coupon) => (
          <Typography key={coupon._id} component="p">
            {coupon.code}
          </Typography>
        ))}
      </Container>
    </>
  );
}

export default Coupon;
