 = 'vj-jpg'
 = 'KAVASAM'
 = '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'
 = " https://api.github.com/repos///contents\
 = 'main'

function Get-FileSha() {
 try {
 = /=
 = Invoke-RestMethod -Method Get -Uri -Headers @{Authorization = \token \; \User-Agent\ = \Antigravity\}
 return .sha
 } catch {
 return 
 }
}

function Push-File() {
 = Split-Path -Parent System.Management.Automation.InvocationInfo.MyCommand.Path
 = Join-Path 
 if (-Not (Test-Path )) { Write-Host \File not found: \; return }
 = Get-Content -Path -Raw
 = [System.Text.Encoding]::UTF8.GetBytes()
 = [Convert]::ToBase64String()
 = /
 = Get-FileSha 
 = @{message = \Add \; content = ; branch = }
 if () { .sha = }
 = | ConvertTo-Json -Depth 10
 try {
 = Invoke-RestMethod -Method Put -Uri -Headers @{Authorization = \token \; \User-Agent\ = \Antigravity\} -Body -ContentType \application/json\
 Write-Host \Pushed \
 } catch {
 Write-Host \Error pushing  : \
 }
}

 = @(
 'README.md',
 'index.html',
 'css/styles.css',
 'js/state.js',
 'js/app.js',
 'process_logo.ps1',
 'server.ps1',
 'start_kavasam.bat'
)

foreach ( in ) { Push-File }

Write-Host \All files pushed.\

# Enable GitHub Pages
 = \https://api.github.com/repos///pages\
 = @{source = @{branch = ; path = '/'}} | ConvertTo-Json -Depth 10
try {
 = Invoke-RestMethod -Method Put -Uri -Headers @{Authorization = \token \; \User-Agent\ = \Antigravity\} -Body -ContentType \application/json\
 Write-Host \GitHub Pages enabled:  \
} catch {
 Write-Host \Error enabling GitHub Pages: \
}
