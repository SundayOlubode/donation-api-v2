curl -i -X POST \
  https://graph.facebook.com/v17.0/123036934236922/messages \
  -H 'Authorization: Bearer EAAK3etim800BO0nZC8Ew7pbvnuLFtodTZCJDJt56YfunqLiIqFidjby2PMLEQPk0Hhm8CspwzZAu8ZBfBPvVt4OLfBdjbPhczLNtsuMxRX33qIZAx8YP7gzIoNUv47skzHEzAuhCRwHwOT1tZBI1ZBhLZBTVg5Ys7F3NiQKmDu25U20sWXhmHjjn46INgxo8bNZAFlKF2SSm0z1kpPQ4fZAsMZD' \
  -H 'Content-Type: application/json' \
  -d '{"messaging_product": "whatsapp", "to": "2348078361244", "type": "template", "template": {"name": "hello_world", "language": {"code": "en_US" } } }'
