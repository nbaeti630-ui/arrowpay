import { ImageResponse } from "next/og";

export const alt = "ArrowPay - Pay Freelancers & Remote Teams, Fast as an Arrow";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style=
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #ec4899 0%, #d946ef 50%, #a855f7 100%)",
          color: "white",
          fontFamily: "sans-serif",
          padding: "60px",
        
      >
        <div style= fontSize: "100px", fontWeight: 800 >ArrowPay</div>
        <div
          style=
            display: "flex",
            fontSize: "46px",
            fontWeight: 700,
            marginTop: "24px",
            maxWidth: "950px",
            textAlign: "center",
            lineHeight: 1.25,
          
        >
          Pay Freelancers & Remote Teams, Fast as an Arrow
        </div>
        <div style= fontSize: "30px", marginTop: "28px", opacity: 0.9 >
          USDC payouts | Multi-chain | On-chain proof
        </div>
      </div>
    ),
    { ...size },
  );
}
