
now=$(date)

echo "$now -> Building..."
ng build --prod
aws s3 sync dist/demo/ s3://miltonjones.nl/

echo "============================================================"
echo "Last upload: $now"
echo "============================================================"
