$credentialPath = "credentials.json"
$dockerUsername = ""

$loginStatus = docker login | findstr "Login Succeeded"

if ($loginStatus -ne "Login Succeeded") {
  $username = Read-Host "Enter your docker username"
  $pat = Read-Host "Enter your docker personal access token (PAT)"

  docker login -u "$username" -p "$pat"
  $dockerUsername = $username
}

if (Test-Path -Path $credentialPath) {
  $credentials = Get-Content -Path $credentialPath -Raw | ConvertFrom-Json
  Write-Output "Preparing the image..."

  docker build -t $($credentials.ImgName) .
  docker push $($credentials.ImgName)

  Write-Output "Deploying the app, please wait..."

  caprover deploy -h "$($credentials.Host)" -p "$($credentials.Password)" -i "$($credentials.ImgName)" --appName "$($credentials.AppName)"
}
else {
  Write-Output "Preparing the image..."

  $uri = Read-Host "Enter your host"
  $hashedPwd = Read-Host "Enter your password" -AsSecureString
  $appName = Read-Host "Enter your app name" 
  $imgName = Read-Host "Enter your docker image name (without docker username)"

  docker build -t "$dockerUsername/$imgName" .
  docker push "$dockerUsername/$imgName"
  
  Write-Output "Deploying the app, please wait..."
  $plainPwd = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($hashedPwd)
  )
  
  caprover deploy -h "$uri" -p "$plainPwd" -i "$dockerUsername/$imgName" --appName "$appName"

  $fileContents = @{
    Host     = $uri
    Password = $plainPwd
    AppName  = $appName
    ImgName  = "$dockerUsername/$imgName"
  }
  $data = $fileContents | ConvertTo-Json -Depth 10

  Set-Content -Path $credentialPath -Value $data
}