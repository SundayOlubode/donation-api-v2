curl -i -X POST $(
  https://graph.facebook.com/v17.0/123036934236922/messages
)
-H 'Authorization: Bearer EAAK3etim800BOwZBqbH6CmlZA6IvL4NR6Nl6llmX7ZCippNokXlTwt9esLA0MZCXGfcFfz7mjQHg51Cacqm0QkFulsZAqMLYMPIXv7eVYjAJ6rmEHCZAIIf875YQeGZCZAKDUzGM8bG2zChLjPOSgrKjMzyTv3tXhOjXs07UPE4fJ1TbfYFLXwrcF8VZA8ADcxCUs3wH92NSeZBwzCprrZBNcMZD' $(
  -H 'Content-Type: application/json'
)
-d '{ \"messaging_product\": \"whatsapp\", \"to\": \"2348078361244\", \"type\": \"template\", \"template\": { \"name\": \"hello_world\", \"language\": { \"code\": \"en_US\" } } }'
