#!/bin/bash

# Path to your .env file
ENV_FILE=".env"

# Check if the .env file exists
if [ -f "$ENV_FILE" ]; then
  echo "Reading variables from $ENV_FILE"

  # Load variables from the .env file
  while IFS='=' read -r key value; do
    if [[ ! "$key" =~ ^(\s*#|\s*$) ]]; then
      # Set the environment variable
      export "$key"="$value"
    fi
  done <"$ENV_FILE"
  echo $CLOUD_API_ACCESS_TOKEN
  # Replace the token in the curl command
  curl -i -X POST \
    https://graph.facebook.com/v17.0/123036934236922/messages \
    -H "Authorization: Bearer $CLOUD_API_ACCESS_TOKEN" \
    -H 'Content-Type: application/json' \
    -d '{"messaging_product": "whatsapp", "to": "2348078361244", "type": "template", "template": {"name": "hello_world", "language": {"code": "en_US" } } }'

else
  echo "Error: $ENV_FILE not found."
  exit 1
fi
