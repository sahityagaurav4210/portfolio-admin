$credentialPath = "credentials.json"
$dockerUsername = ""
$branch = ""

$loginStatus = docker login | findstr "Login Succeeded"

if ($loginStatus -ne "Login Succeeded") {
  $branch = Read-Host "Enter the branch name"
}

if (Test-Path -Path $credentialPath) {
  $credentials = Get-Content -Path $credentialPath -Raw | ConvertFrom-Json
  
  if ($credentials.Branch) {
    Write-Output "Deploying the app, please wait..."

    caprover deploy -h "$($credentials.Host)" -p "$($credentials.Password)" --appName "$($credentials.AppName)" --branch "$($credentials.Branch)"
    
    return;
  }
  
  Write-Output "Preparing the image..."
  docker build --build-args VITE_API_TIMEOUT=$($credentials.VITE_API_TIMEOUT) --build-args VITE_API_BASE_URL=$($credentials.VITE_API_BASE_URL) --build-args VITE_APP_ENV=$($credentials.VITE_APP_ENV) -t $($credentials.ImgName) .
  docker push $($credentials.ImgName)

  Write-Output "Deploying the app, please wait..."

  caprover deploy -h "$($credentials.Host)" -p "$($credentials.Password)" -i "$($credentials.ImgName)" --appName "$($credentials.AppName)"
}
else {
  Write-Output "Preparing the image..."

  if ($branch -ne "") {
    $uri = Read-Host "Enter your caprover host"
    $hashedPwd = Read-Host "Enter your caprover password" -AsSecureString
    $appName = Read-Host "Enter your app name" 
    $plainPwd = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
      [Runtime.InteropServices.Marshal]::SecureStringToBSTR($hashedPwd)
    )

    caprover deploy -h "$uri" -p "$plainPwd" --appName "$appName" --branch "$branch" 

    $fileContents = @{
      Host     = $uri
      Password = $plainPwd
      AppName  = $appName
      Branch   = $branch
    }
    $data = $fileContents | ConvertTo-Json -Depth 10
  
    Set-Content -Path $credentialPath -Value $data -Encoding UTF8
    return;
  }
  
  $dockerUsername = Read-Host "Enter your docker username"
  $uri = Read-Host "Enter your caprover host"
  $hashedPwd = Read-Host "Enter your caprover password" -AsSecureString
  $appName = Read-Host "Enter your app name" 
  $imgName = Read-Host "Enter your docker image name (without docker username)"
  $viteApiBaseUrl = Read-Host "Enter your api base url";
  $viteAppEnv = Read-Host "Enter your app environment"
  $viteApiTimeout = Read-Host "Enter your api timeout"

  docker build --build-args VITE_API_BASE_URL=$viteApiBaseUrl --build-args VITE_APP_ENV=$viteAppEnv --build-args VITE_API_TIMEOUT=$viteApiTimeout -t "$dockerUsername/$imgName" .
  docker push "$dockerUsername/$imgName"
  
  Write-Output "Deploying the app, please wait..."
  $plainPwd = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($hashedPwd)
  )
  
  caprover deploy -h "$uri" -p "$plainPwd" -i "$dockerUsername/$imgName" --appName "$appName"

  $fileContents = @{
    Host              = $uri
    Password          = $plainPwd
    AppName           = $appName
    ImgName           = "$dockerUsername/$imgName"
    VITE_APP_ENV      = $viteAppEnv
    VITE_API_BASE_URL = $viteApiBaseUrl
    VITE_API_TIMEOUT  = $viteApiTimeout
  }
  $data = $fileContents | ConvertTo-Json -Depth 10

  Set-Content -Path $credentialPath -Value $data -Encoding UTF8
}