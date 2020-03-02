mkdir common
cp ../common/* common
gcloud builds submit \
  --tag gcr.io/$GOOGLE_CLOUD_PROJECT/lab-report-service
gcloud run deploy lab-report-service \
  --image gcr.io/$GOOGLE_CLOUD_PROJECT/lab-report-service \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
rm -R common

