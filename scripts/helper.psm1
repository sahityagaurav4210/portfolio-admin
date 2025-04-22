function Convert-SecureStringToPlainText {
  param (
      [System.Security.SecureString]$SecureString
  )

  $ptr = [System.Runtime.InteropServices.Marshal]::SecureStringToGlobalAllocUnicode($SecureString)
  try {
      [System.Runtime.InteropServices.Marshal]::PtrToStringUni($ptr)
  }
  finally {
      [System.Runtime.InteropServices.Marshal]::ZeroFreeGlobalAllocUnicode($ptr)
  }
}

Export-ModuleMember -Function Convert-SecureStringToPlainText