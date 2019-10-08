SERVICE_URL=[URL]

curl -X POST \
  -H "Content-Type: application/json" \
  -d "{\"id\": 12}" \
  $SERVICE_URL &
curl -X POST \
  -H "Content-Type: application/json" \
  -d "{\"id\": 34}" \
  $SERVICE_URL &
curl -X POST \
  -H "Content-Type: application/json" \
  -d "{\"id\": 56}" \
  $SERVICE_URL &
