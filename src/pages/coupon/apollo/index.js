import { gql } from "@apollo/client";

export const QUERY_COUPON = gql`
  query Coupon {
    coupons {
      data {
        _id
        amount
        code
        typeCouponID {
          _id
          status
          expird
        }
      }
      total
    }
  }
`;
