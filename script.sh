curl -X POST https://messages-sandbox.nexmo.com/v1/messages \
  -u '44f157fc:MZWc6RydKJc48cke' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -d '{
    "from": "250791982790",
    "to": "14157386102",
    "message_type": "text",
    "text": "This is a WhatsApp Message sent from the Messages API",
    "channel": "whatsapp"
  }'
