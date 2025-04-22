Import-Module "$PSScriptRoot\..\helper.psm1"


$credentialPath = "$PSScriptRoot\..\..\credentials.json"
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
  docker build -t $($credentials.ImgName) .
  CheckCmdStatus -Msg "Build failed, exiting..."

  docker push $($credentials.ImgName)
  CheckCmdStatus -Msg "Build upload failed, exiting..."

  Write-Output "================================="
  Write-Output "Deploying the app, please wait..."

  caprover deploy -h "$($credentials.Host)" -p "$($credentials.Password)" -i "$($credentials.ImgName)" --appName "$($credentials.AppName)"
  CheckCmdStatus -Msg "Deploy failed, exiting..."
}
else {
  Write-Output "Preparing the image..."

  if ($branch -ne "") {
    $uri = Read-Host "Enter your caprover host"
    $hashedPwd = Read-Host "Enter your caprover password" -AsSecureString
    $appName = Read-Host "Enter your app name" 
    $plainPwd = Convert-SecureStringToPlainText -SecureString $hashedPwd

    caprover deploy -h "$uri" -p "$plainPwd" --appName "$appName" --branch "$branch" 
    CheckCmdStatus -Msg "Deploy failed, exiting..."

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

  docker build -t "$dockerUsername/$imgName" .
  CheckCmdStatus -Msg "Build failed, exiting..."

  docker push "$dockerUsername/$imgName"
  CheckCmdStatus -Msg "Build upload, exiting..."
  
  Write-Output "Deploying the app, please wait..."
  $plainPwd = $plainPwd = Convert-SecureStringToPlainText -SecureString $hashedPwd
  
  caprover deploy -h "$uri" -p "$plainPwd" -i "$dockerUsername/$imgName" --appName "$appName"
  CheckCmdStatus -Msg "Deploy failed, exiting..."

  $fileContents = @{
    Host     = $uri
    Password = $plainPwd
    AppName  = $appName
    ImgName  = "$dockerUsername/$imgName"
  }
  $data = $fileContents | ConvertTo-Json -Depth 10

  Set-Content -Path $credentialPath -Value $data -Encoding UTF8
}