mkdir common
cp ../common/* common

gcloud builds submit \
  --tag gcr.io/$GOOGLE_CLOUD_PROJECT/email-service

gcloud beta run deploy email-service \
  --image gcr.io/$GOOGLE_CLOUD_PROJECT/email-service \
  --platform managed \
  --region us-central1 \
  --no-allow-unauthenticated

rm -R common
