docker build -t prelegal .
docker run -d --name prelegal -p 8000:8000 prelegal
Write-Host "PreLegal is running at http://localhost:8000"
