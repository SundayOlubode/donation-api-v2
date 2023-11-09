curl -X POST https://messages-sandbox.nexmo.com/v1/messages \
  -u 'ght' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -d '{
    "from": "250791982790",
    "to": "14157386102",
    "message_type": "text",
    "text": "This is a WhatsApp Message sent Donation API",
    "channel": "whatsapp"
  }'
