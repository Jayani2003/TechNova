const nodemailer = require('nodemailer');

// Helper to format currency
const formatMoney = (value) => {
  if (value === null || value === undefined) return 'N/A';
  const n = Number(value);
  if (Number.isNaN(n)) return 'N/A';
  return `LKR ${n.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// Get booking reference code
const getBookingReference = (tourType, bookingId) => {
  const type = String(tourType || 'P2P').toUpperCase();
  const typeCode = type === 'PACKAGE' ? 'PKG' : type === 'CUSTOM' ? 'CUS' : 'P2P';
  return `CBT-${typeCode}-${bookingId}`;
};

// Generate payment schedule HTML lines
const getPaymentScheduleHtml = (tourType, quotedPrice) => {
  const amount = Number(quotedPrice || 0);
  const isP2P = String(tourType || 'P2P').toUpperCase() === 'P2P';

  if (isP2P) {
    return `<li><strong>Full Payment:</strong> ${formatMoney(amount)} payable before trip start.</li>`;
  }

  const deposit = amount * 0.3;
  const final = amount - deposit;

  return `
    <li><strong>Deposit (30%):</strong> ${formatMoney(deposit)} payable at confirmation.</li>
    <li><strong>Final Balance (70%):</strong> ${formatMoney(final)} payable before trip start.</li>
  `;
};

// Main function to send confirmation email
const sendBookingConfirmationEmail = async (booking, recipientEmail) => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.EMAIL_FROM || '"Ceylon Best Tours" <noreply@ceylonbesttours.com>';

  const bookingRef = getBookingReference(booking.tour_type, booking.booking_id);
  const formattedPrice = formatMoney(booking.quoted_price);
  const startDate = booking.start_date ? new Date(booking.start_date).toDateString() : 'N/A';
  const endDate = booking.end_date ? new Date(booking.end_date).toDateString() : 'N/A';
  const frontendUrl = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

  // Beautiful HTML body
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Confirmation - Ceylon Best Tours</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap');
        
        body {
          font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f1f5f9;
          color: #1e293b;
          -webkit-font-smoothing: antialiased;
        }
        
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
          border: 1px solid #e2e8f0;
        }
        
        .header {
          background: linear-gradient(135deg, #00b0a5 0%, #0d9488 100%);
          padding: 40px 30px;
          text-align: center;
        }
        
        .header h1 {
          color: #ffffff;
          margin: 0 0 10px 0;
          font-size: 28px;
          font-weight: 700;
          letter-spacing: -0.5px;
        }
        
        .header p {
          color: rgba(255, 255, 255, 0.9);
          margin: 0;
          font-size: 16px;
          font-weight: 300;
        }
        
        .content {
          padding: 40px 30px;
        }
        
        .greeting {
          font-size: 20px;
          font-weight: 600;
          margin-top: 0;
          margin-bottom: 12px;
          color: #0f172a;
        }
        
        .intro {
          font-size: 15px;
          line-height: 1.6;
          color: #475569;
          margin-bottom: 30px;
        }
        
        .details-card {
          background-color: #f8fafc;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          padding: 24px;
          margin-bottom: 30px;
        }
        
        .details-title {
          font-size: 16px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #0f172a;
          margin-top: 0;
          margin-bottom: 18px;
          border-bottom: 2px solid #e2e8f0;
          padding-bottom: 8px;
        }
        
        .detail-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          font-size: 15px;
        }
        
        .detail-row:last-child {
          margin-bottom: 0;
        }
        
        .detail-label {
          color: #64748b;
          font-weight: 400;
        }
        
        .detail-value {
          color: #0f172a;
          font-weight: 600;
          text-align: right;
        }
        
        .price-section {
          background: #f0fdfa;
          border-radius: 12px;
          border: 1px solid #ccfbf1;
          padding: 20px 24px;
          margin-bottom: 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .price-label {
          font-size: 16px;
          font-weight: 600;
          color: #0d9488;
        }
        
        .price-amount {
          font-size: 22px;
          font-weight: 700;
          color: #0f172a;
        }
        
        .payment-schedule {
          margin-bottom: 30px;
        }
        
        .payment-schedule h3 {
          font-size: 15px;
          font-weight: 600;
          color: #0f172a;
          margin-top: 0;
          margin-bottom: 10px;
        }
        
        .payment-schedule ul {
          padding-left: 20px;
          margin: 0;
          font-size: 14px;
          color: #475569;
          line-height: 1.6;
        }
        
        .btn-container {
          text-align: center;
          margin: 35px 0 10px 0;
        }
        
        .btn {
          display: inline-block;
          background-color: #00b0a5;
          color: #ffffff !important;
          text-decoration: none;
          padding: 14px 28px;
          font-size: 15px;
          font-weight: 600;
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 176, 165, 0.2), 0 2px 4px -1px rgba(0, 176, 165, 0.1);
          transition: background-color 0.2s;
        }
        
        .btn:hover {
          background-color: #0d9488;
        }
        
        .footer {
          background-color: #f8fafc;
          padding: 30px;
          text-align: center;
          border-top: 1px solid #e2e8f0;
          font-size: 13px;
          color: #64748b;
          line-height: 1.5;
        }
        
        .footer a {
          color: #00b0a5;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Booking Confirmed!</h1>
          <p>Thank you for choosing Ceylon Best Tours</p>
        </div>
        
        <div class="content">
          <div class="greeting">Hi ${booking.customer_name || 'Valued Customer'},</div>
          <div class="intro">
            We are excited to let you know that your booking has been successfully confirmed. Our team is preparing to deliver an unforgettable travel experience for you. Here are your booking details:
          </div>
          
          <div class="details-card">
            <div class="details-title">Booking Summary</div>
            <div class="detail-row">
              <span class="detail-label">Booking Reference</span>
              <span class="detail-value">${bookingRef}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Tour Type</span>
              <span class="detail-value">${String(booking.tour_type || 'P2P').toUpperCase()}</span>
            </div>
            ${booking.package_name ? `
            <div class="detail-row">
              <span class="detail-label">Package Name</span>
              <span class="detail-value">${booking.package_name}</span>
            </div>` : ''}
            <div class="detail-row">
              <span class="detail-label">Start Date</span>
              <span class="detail-value">${startDate}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">End Date</span>
              <span class="detail-value">${endDate}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Vehicle Category</span>
              <span class="detail-value">${booking.category_name || 'N/A'}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Guests</span>
              <span class="detail-value">${booking.no_of_adults || 1} Adults${booking.no_of_children ? `, ${booking.no_of_children} Children` : ''}</span>
            </div>
          </div>
          
          <div class="price-section">
            <span class="price-label">Confirmed Price</span>
            <span class="price-amount">${formattedPrice}</span>
          </div>
          
          <div class="payment-schedule">
            <h3>Payment Guidelines</h3>
            <ul>
              ${getPaymentScheduleHtml(booking.tour_type, booking.quoted_price)}
            </ul>
          </div>
          
          <div class="btn-container">
            <a href="${frontendUrl}/my-bookings" class="btn">View Your Bookings</a>
          </div>
        </div>
        
        <div class="footer">
          <p>If you have any questions or need to make changes, please don't hesitate to reach out.</p>
          <p>
            <strong>Ceylon Best Tours</strong><br>
            Email: <a href="mailto:support@ceylonbesttours.com">support@ceylonbesttours.com</a> | Phone: +94 77 123 4567
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Check if SMTP is configured. If not, fallback to console log.
  if (!host || !user || !pass) {
    console.log('========================================================================');
    console.log(`[EMAIL MOCK] SMTP configuration missing. Outputting email to console:`);
    console.log(`To: ${recipientEmail}`);
    console.log(`Subject: Booking Confirmation: ${bookingRef}`);
    console.log(`Body: HTML content generated (length: ${htmlContent.length} chars)`);
    console.log('========================================================================');
    return { success: true, mock: true };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port: Number(port) || 587,
      secure: Number(port) === 465, // true for 465, false for other ports
      auth: {
        user,
        pass,
      },
    });

    const info = await transporter.sendMail({
      from,
      to: recipientEmail,
      subject: `Booking Confirmation: ${bookingRef}`,
      html: htmlContent,
    });

    console.log(`[Email] Booking confirmation sent to ${recipientEmail}. Message ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[Email] Failed to send email to ${recipientEmail}:`, error);
    // Return error status so the controller can log it, but do not throw it
    return { success: false, error };
  }
};

// Email sent when a booking is first submitted (status: PENDING)
const sendBookingReceivedEmail = async (booking, recipientEmail) => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.EMAIL_FROM || '"Ceylon Best Tours" <noreply@ceylonbesttours.com>';

  const bookingRef = getBookingReference(booking.tour_type, booking.booking_id);
  const startDate = booking.start_date ? new Date(booking.start_date).toDateString() : 'N/A';
  const endDate = booking.end_date ? new Date(booking.end_date).toDateString() : 'N/A';
  const frontendUrl = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Received - Ceylon Best Tours</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap');
        
        body {
          font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f1f5f9;
          color: #1e293b;
          -webkit-font-smoothing: antialiased;
        }
        
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
          border: 1px solid #e2e8f0;
        }
        
        .header {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          padding: 40px 30px;
          text-align: center;
        }
        
        .header h1 {
          color: #ffffff;
          margin: 0 0 10px 0;
          font-size: 28px;
          font-weight: 700;
          letter-spacing: -0.5px;
        }
        
        .header p {
          color: rgba(255, 255, 255, 0.9);
          margin: 0;
          font-size: 16px;
          font-weight: 300;
        }
        
        .content {
          padding: 40px 30px;
        }
        
        .greeting {
          font-size: 20px;
          font-weight: 600;
          margin-top: 0;
          margin-bottom: 12px;
          color: #0f172a;
        }
        
        .intro {
          font-size: 15px;
          line-height: 1.6;
          color: #475569;
          margin-bottom: 30px;
        }
        
        .details-card {
          background-color: #f8fafc;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          padding: 24px;
          margin-bottom: 30px;
        }
        
        .details-title {
          font-size: 16px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #0f172a;
          margin-top: 0;
          margin-bottom: 18px;
          border-bottom: 2px solid #e2e8f0;
          padding-bottom: 8px;
        }
        
        .detail-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          font-size: 15px;
        }
        
        .detail-row:last-child {
          margin-bottom: 0;
        }
        
        .detail-label {
          color: #64748b;
          font-weight: 400;
        }
        
        .detail-value {
          color: #0f172a;
          font-weight: 600;
          text-align: right;
        }

        .status-badge {
          display: inline-block;
          background: #fef3c7;
          color: #92400e;
          font-size: 13px;
          font-weight: 600;
          padding: 6px 14px;
          border-radius: 20px;
          letter-spacing: 0.5px;
        }

        .next-steps {
          background: #fffbeb;
          border: 1px solid #fef3c7;
          border-radius: 12px;
          padding: 20px 24px;
          margin-bottom: 30px;
        }

        .next-steps h3 {
          font-size: 15px;
          font-weight: 600;
          color: #92400e;
          margin-top: 0;
          margin-bottom: 12px;
        }

        .next-steps ol {
          padding-left: 20px;
          margin: 0;
          font-size: 14px;
          color: #78716c;
          line-height: 1.8;
        }
        
        .btn-container {
          text-align: center;
          margin: 35px 0 10px 0;
        }
        
        .btn {
          display: inline-block;
          background-color: #f59e0b;
          color: #ffffff !important;
          text-decoration: none;
          padding: 14px 28px;
          font-size: 15px;
          font-weight: 600;
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(245, 158, 11, 0.2), 0 2px 4px -1px rgba(245, 158, 11, 0.1);
        }
        
        .footer {
          background-color: #f8fafc;
          padding: 30px;
          text-align: center;
          border-top: 1px solid #e2e8f0;
          font-size: 13px;
          color: #64748b;
          line-height: 1.5;
        }
        
        .footer a {
          color: #f59e0b;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Booking Received!</h1>
          <p>We've got your booking request</p>
        </div>
        
        <div class="content">
          <div class="greeting">Hi ${booking.customer_name || 'Valued Customer'},</div>
          <div class="intro">
            Thank you for submitting your booking with Ceylon Best Tours! We have received your request and our team will review it shortly. You will receive another email once your booking has been confirmed.
          </div>
          
          <div class="details-card">
            <div class="details-title">Booking Summary</div>
            <div class="detail-row">
              <span class="detail-label">Booking Reference</span>
              <span class="detail-value">${bookingRef}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Status</span>
              <span class="detail-value"><span class="status-badge">Pending Review</span></span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Tour Type</span>
              <span class="detail-value">${String(booking.tour_type || 'P2P').toUpperCase()}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Start Date</span>
              <span class="detail-value">${startDate}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">End Date</span>
              <span class="detail-value">${endDate}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Guests</span>
              <span class="detail-value">${booking.no_of_adults || 1} Adults${booking.no_of_children ? `, ${booking.no_of_children} Children` : ''}</span>
            </div>
          </div>

          <div class="next-steps">
            <h3>What Happens Next?</h3>
            <ol>
              <li>Our team will review your booking details</li>
              <li>We'll send you a price quote for your trip</li>
              <li>Once you accept, your booking will be confirmed</li>
              <li>You'll receive a final confirmation email with all details</li>
            </ol>
          </div>
          
          <div class="btn-container">
            <a href="${frontendUrl}/user/profile" class="btn">Track Your Booking</a>
          </div>
        </div>
        
        <div class="footer">
          <p>If you have any questions, feel free to reach out to us anytime.</p>
          <p>
            <strong>Ceylon Best Tours</strong><br>
            Email: <a href="mailto:support@ceylonbesttours.com">support@ceylonbesttours.com</a> | Phone: +94 77 123 4567
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  if (!host || !user || !pass) {
    console.log('========================================================================');
    console.log(`[EMAIL MOCK] SMTP configuration missing. Outputting email to console:`);
    console.log(`To: ${recipientEmail}`);
    console.log(`Subject: Booking Received: ${bookingRef}`);
    console.log(`Body: HTML content generated (length: ${htmlContent.length} chars)`);
    console.log('========================================================================');
    return { success: true, mock: true };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port: Number(port) || 587,
      secure: Number(port) === 465,
      auth: { user, pass },
    });

    const info = await transporter.sendMail({
      from,
      to: recipientEmail,
      subject: `Booking Received: ${bookingRef}`,
      html: htmlContent,
    });

    console.log(`[Email] Booking received email sent to ${recipientEmail}. Message ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[Email] Failed to send booking received email to ${recipientEmail}:`, error);
    return { success: false, error };
  }
};

module.exports = {
  sendBookingConfirmationEmail,
  sendBookingReceivedEmail,
};
