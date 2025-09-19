const OrderCreateEmailTemplate = ({
  name,
  email,
  phone,
  productType,
  brand,
  size,
  colour,
  address,
  orderId,
  orderDate = new Date().toLocaleDateString(),
  currentYear = new Date().getFullYear()
}) => {
  return `
<!DOCTYPE html>
<html>
  <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
    <h2 style="color:#2c3e50;">Thank you for your order, ${name}!</h2>
    <p>We’ve received your order <strong>#${orderId}</strong> placed on ${orderDate}.</p>
    
    <h3 style="margin-top:20px;">Order Details:</h3>
    <table style="width:100%; border-collapse: collapse;">
      <tr style="background:#f4f4f4;">
        <th align="left" style="padding:8px; border:1px solid #ddd;">Field</th>
        <th align="left" style="padding:8px; border:1px solid #ddd;">Value</th>
      </tr>
      <tr>
        <td style="padding:8px; border:1px solid #ddd;">Name</td>
        <td style="padding:8px; border:1px solid #ddd;">${name}</td>
      </tr>
      <tr>
        <td style="padding:8px; border:1px solid #ddd;">Email</td>
        <td style="padding:8px; border:1px solid #ddd;">${email}</td>
      </tr>
      <tr>
        <td style="padding:8px; border:1px solid #ddd;">Phone</td>
        <td style="padding:8px; border:1px solid #ddd;">${phone}</td>
      </tr>
      <tr>
        <td style="padding:8px; border:1px solid #ddd;">Product Type</td>
        <td style="padding:8px; border:1px solid #ddd;">${productType}</td>
      </tr>
      <tr>
        <td style="padding:8px; border:1px solid #ddd;">Brand</td>
        <td style="padding:8px; border:1px solid #ddd;">${brand}</td>
      </tr>
      <tr>
        <td style="padding:8px; border:1px solid #ddd;">Size</td>
        <td style="padding:8px; border:1px solid #ddd;">${size}</td>
      </tr>
      <tr>
        <td style="padding:8px; border:1px solid #ddd;">Colour</td>
        <td style="padding:8px; border:1px solid #ddd;">${colour}</td>
      </tr>
      <tr>
        <td style="padding:8px; border:1px solid #ddd;">Address</td>
        <td style="padding:8px; border:1px solid #ddd;">${address}</td>
      </tr>
    </table>

    <p>We’ll notify you once your order is shipped. 🎁</p>
    <p>Need help? Contact us at <a href="mailto:support@Scarlit.com">support@Scarlit.com</a></p>
    
    <hr>
    <p style="font-size:12px; color:#777;">
      © ${currentYear} Scarlit. All rights reserved.
    </p>
  </body>
</html>
  `;
};

export default OrderCreateEmailTemplate;