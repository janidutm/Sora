[CmdletBinding(SupportsShouldProcess=$true,ConfirmImpact='High')]
param([switch]$KeepDownloads)
$ErrorActionPreference='Stop'
$root=[IO.Path]::GetFullPath($PSScriptRoot).TrimEnd('\')
$expected=[IO.Path]::GetFullPath((Join-Path ([Environment]::GetFolderPath('MyDocuments')) 'MADEWITHGPT\Sora')).TrimEnd('\')
if($root -ne $expected -or -not (Test-Path -LiteralPath (Join-Path $root 'package.json'))){throw 'Unexpected project path; refusing deletion.'}
$running=Get-CimInstance Win32_Process | Where-Object { ($_.ExecutablePath -and $_.ExecutablePath.StartsWith(($root+'\'),[StringComparison]::OrdinalIgnoreCase)) -or ($_.Name -eq 'bash.exe' -and $_.CommandLine -and $_.CommandLine.Contains($root)) }
if($running -and -not $WhatIfPreference){throw 'Close Sora and its mpv player first, then try again.'}
if($PSCmdlet.ShouldProcess($root,'Remove Sora source, bundled tools, application data, and downloads')){
  if($KeepDownloads){
    $downloads=[IO.Path]::GetFullPath((Join-Path $root 'downloads'))
    $parent=[IO.Path]::GetFullPath((Split-Path -Parent $root)).TrimEnd('\')
    $destination=[IO.Path]::GetFullPath((Join-Path $parent ('Sora-downloads-'+(Get-Date -Format 'yyyyMMdd-HHmmss'))))
    if(-not $downloads.StartsWith(($root+'\')) -or -not $destination.StartsWith(($parent+'\'))){throw 'Unexpected download move path.'}
    if(Test-Path -LiteralPath $downloads){Move-Item -LiteralPath $downloads -Destination $destination}
  }
  Set-Location -LiteralPath (Split-Path -Parent $root)
  Remove-Item -LiteralPath $root -Recurse -Force
  Write-Output 'Sora removed. Existing Git, Node.js and FFmpeg were preserved.'
}
